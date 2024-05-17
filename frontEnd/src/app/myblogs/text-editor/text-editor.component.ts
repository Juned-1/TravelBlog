import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Quill, { RangeStatic } from 'quill';
import { ModalController } from '@ionic/angular';
import { PreviewComponent } from './preview/preview.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import * as cheerio from 'cheerio';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { Post, PostData, sendPostBulk } from 'src/DataTypes';
import ImageCompress from 'quill-image-compress';
import { Subscription } from 'rxjs';
import { MyblogsService } from '../myblogs.service';
import { blog } from 'src/DataTypes';

Quill.register('modules/imageCompress', ImageCompress);

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  standalone: true,
  imports: [IonicModule, PreviewComponent, ToolbarComponent, FormsModule],
})
export class TextEditorComponent  implements OnInit, OnDestroy {

  linkCount: number = 0;
  maxLinks: number = 5;
  imageCount: number = 0;
  maxImage: number = 5;
  videoCount: number = 0;
  maxVideo: number = 1;
  editor!: Quill;
  options = {
    modules: {
      imageCompress: {
        quality: 0.7, // default
        maxWidth: 800, // default
        maxHeight: 800, // default
        imageType: 'image/webp', // default
        debug: true, // default
        suppressErrorLogging: false, // default
        insertIntoEditor: undefined, // default
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],

        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        // ['clean'],
        ['link', 'image', 'video'],
      ],
    },
    placeholder:
      'CONTENT\nNote: max images: 4,\n\t\t max video: 1(appended at the end)\n',
    theme: 'snow',
  };
  content: string = '';
  isLoggedIn = false;
  title: string = '';
  subtitle: string = '';
  id!: string;
  edit: boolean = false;
  routerService! : Subscription;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private api: APIService,
    private toast: ToastrService,
    private myBlogsService: MyblogsService

  ) {}
  ngOnInit() {
    this.routerService = this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        if(localStorage.getItem('travel-blog') !== null){
          this.isLoggedIn = true;
        }
      }
    });
    this.initQuill();
  }
  initQuill() {
    let container = document.getElementById('editor');
    this.editor = new Quill(container!, this.options);

    const toolbar = this.editor.getModule('toolbar');
    toolbar.addHandler('link', this.imageHandler.bind(this));
    //this.imageLinkButton();
    let id = this.route.snapshot.queryParams['id'];
    if (id != undefined) {
      this.edit = true;
      this.id = id;
      this.api.getSpecificPost(this.id).subscribe(
        (response) => {
          if (
            'status' in response &&
            response.status === 'success' &&
            'data' in response
          ) {
            const post = (response.data as PostData).post as Post;
            this.content = post.content;
            this.title = post.title;
            this.subtitle = post.subtitle;
            this.editor.root.innerHTML = this.content;
          }

          // if (post.post_video_url) {
          //   this.content = this.content.concat(
          //     this.prepareFrame(post.post_video_url)
          //   );
          //}
        },
        (err) => {
          this.toast.error('Error loading post');
          console.log(err);
        }
      );
    }
  }
  imageHandler() {
    console.log('Hello');
    console.log(this.editor);
    const range = this.editor.getSelection();

    console.log(range);
    const value = prompt('please copy paste the image url here.');
    if (value) {
      this.editor.insertEmbed(range!.index, 'image', value, Quill.sources.USER);
    }
  }
  prepareFrame(src: string) {
    const ifrm = document.createElement('iframe');
    ifrm.setAttribute('src', src);
    ifrm.style.width = '640px';
    ifrm.style.height = '480px';
    return ifrm.outerHTML;
  }

  ngAfterViewInit() {
    this.editor.getModule('toolbar').addHandler('font', (value: any) => {
      this.editor.format('font', value);
    });
    // Add a handler to track link additions
    this.editor.on('text-change', () => {
      const links = this.countLinksInEditor();
      this.linkCount = links.length;
      this.toggleLinkButton();
      const image = this.countImageInEditor();
      this.imageCount = image.length;
      this.toggleImageButton();
      const iframe = this.countIframeInEditor();
      this.videoCount = iframe.length;
      this.toggleIframeButton();
    });

    this.toggleLinkButton(); // Initial state
  }
  post() {
    this.content = this.editor.root.innerHTML;
    if (this.content.length < 50) {
      this.toast.warning('Content too small!!!');
      return;
    }
    let title = this.title; //        this.getTitle();
    if (title.length === 0) {
      this.toast.warning('Title missing!');
      return;
    }
    let subtitle = this.subtitle; //     this.getSubTitle();
    if (subtitle.length === 0) {
      this.toast.warning('Sub Title missing!');
      return;
    }

    let postDetails: sendPostBulk = {
      title,
      subtitle,
      content: this.content,
    };
    if (this.edit == true) {
      this.editBlog(postDetails);
      return;
    }

    this.api.post(postDetails).subscribe(
      (response) => {
        this.myBlogsService.addNewblog(response)
        if ('status' in response && response.status === 'success') {
          this.toast.success('Posted successfully');
          this.router.navigateByUrl('/userblog');
        }
      },
      (err) => {
        this.toast.error('Post unsuccessful');
        console.log(err);
      }
    );
  }
  
  editBlog(postDetails: any) {
    this.api.editPost(postDetails, this.id).subscribe(
      (response) => {
        if ('status' in response && response.status === 'success') {
          this.toast.success('Posted edited successfully');
          this.router.navigate(['/userblog']);
        }
      },
      (err) => {
        this.toast.error('Edit unsuccessful');
        console.log(err);
      }
    );
  }
  countLinksInEditor(): any {
    const content = this.editor.root.innerHTML;
    const regex = /<a href="(.*?)"/g;
    let match;
    let linkURL: any = [];
    while ((match = regex.exec(content)) !== null) {
      linkURL.push(match);
    }
    return linkURL;
  }
  toggleLinkButton() {
    const linkButton = this.editor
      .getModule('toolbar')
      .container.querySelector('.ql-link');
    if (this.linkCount >= this.maxLinks) {
      linkButton.disabled = true;
    } else {
      linkButton.disabled = false;
    }
  }

  countImageInEditor() {
    const content = this.editor.root.innerHTML;
    const regex = /<img src="(.*?)"/g;
    let match;
    let imageURL: any = [];
    while ((match = regex.exec(content)) !== null) {
      imageURL.push(match);
    }
    return imageURL;
  }

  toggleImageButton() {
    const imageButton = this.editor
      .getModule('toolbar')
      .container.querySelector('.ql-image');
    if (this.imageCount >= this.maxImage) {
      imageButton.disabled = true;
    } else {
      imageButton.disabled = false;
    }
  }
  countIframeInEditor() {
    const content = this.editor.root.innerHTML;
    const regex = /<iframe class="(.*?)"/g;
    let match;
    let iframeURL: any = [];
    while ((match = regex.exec(content)) !== null) {
      iframeURL.push(match);
    }
    return iframeURL;
  }
  toggleIframeButton() {
    const videoButton = this.editor
      .getModule('toolbar')
      .container.querySelector('.ql-video');
    if (this.videoCount >= this.maxVideo) {
      videoButton.disabled = true;
    } else {
      videoButton.disabled = false;
    }
  }
  async preview() {
    const modal = await this.modalCtrl.create({
      component: PreviewComponent,
      componentProps: { data: this.editor.root.innerHTML },
    });
    await modal.present();
  }
  async clearEditor() {
    this.editor.setText('');
  }

  getUrl() {
    // Load the HTML content using cheerio
    const $ = cheerio.load(this.content);

    // Find the iframe element
    const iframe = $('iframe');

    // Check if an iframe element is found
    if (iframe.length > 0) {
      // Get the value of the src attribute
      this.content = this.content.replace(iframe.toString(), '');
      const srcValue = iframe.attr('src');
      return srcValue || null;
    } else {
      // Return null if no iframe element is found
      return null;
    }
  }
  ngOnDestroy(): void {
    this.routerService.unsubscribe();
  }

}