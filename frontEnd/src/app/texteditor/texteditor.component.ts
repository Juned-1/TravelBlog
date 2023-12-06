import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Quill from 'quill';
import { ModalController } from '@ionic/angular';
import { PreviewComponent } from './preview/preview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import * as cheerio from 'cheerio';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import ImageCompress from 'quill-image-compress';
Quill.register('modules/imageCompress', ImageCompress);


@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.scss'],
  standalone: true,
  imports: [IonicModule, PreviewComponent, ToolbarComponent, FormsModule],
})
export class TexteditorComponent implements OnInit {
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

        ['clean'],

        ['link', 'image', 'video'],
      ],
    },
    placeholder: 'CONTENT\nNote: max images: 4,\n\t\t max video: 1(appended at the end)\n',
    theme: 'snow',
  };
  blog_content: string = '';
  isLoggedIn = false;
  title: String = '';
  sub_title: String = '';
  id: number = -1;
  edit: boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private api: APIService,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    let container = document.getElementById('editor');
    this.editor = new Quill(container!, this.options);
    let toolbar = this.editor.getModule('toolbar');

    this.api.authorise().subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        if (data.message === 'Token verified') {
          this.isLoggedIn = true;
        }
      },
      (err) => {
        localStorage.removeItem('travel-blog');
        this.isLoggedIn = false;
      }
    );
    let id = this.route.snapshot.queryParams['id'];
    if (id != undefined) {
      this.edit = true;
      this.id = id;
      this.api.getSpecificPost(this.id).subscribe(
        (response) => {
          const data = JSON.parse(JSON.stringify(response));
          let post = data.result[0];
          this.blog_content = post.post_content;
          this.title = post.post_title;
          this.sub_title = post.post_subtitle;
          if (post.post_video_url) {
            this.blog_content = this.blog_content.concat(
              this.prepareFrame(post.post_video_url)
            );
          }
          this.editor.root.innerHTML = this.blog_content;
        },
        (err) => {
          this.toast.error('Error loading post');
          console.log(err);
        }
      );
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
    this.blog_content = this.editor.root.innerHTML;
    if (this.blog_content.length < 50) {
      this.toast.warning('Content too small!!!');
      return;
    }
    let title = this.title; //        this.getTitle();
    if (title.length === 0) {
      this.toast.warning('Title missing!');
      return;
    }
    let subtitle = this.sub_title; //     this.getSubTitle();
    if (subtitle.length === 0) {
      this.toast.warning('Sub Title missing!');
      return;
    }
    let url = this.getUrl();

    let postDetails = {
      title,
      subtitle,
      post: this.blog_content,
      url,
    };
    if (this.edit == true) {
      this.editBlog(postDetails);
      return;
    }

    this.api.post(postDetails).subscribe(
      (response) => {
        if ('message' in response && response.message === 'ok') {
          this.toast.success('Posted successfully');
          this.router.navigate(['/userblog']);
        }
      },
      (err) => {
        this.toast.error('Post unsuccessful');
        console.log(err);
      }
    );
  }
  editBlog(postDetails: any) {
    postDetails = {
      ...postDetails,
      post_id: this.id,
    };
    this.api.editPost(postDetails).subscribe(
      (response) => {
        if ('message' in response && response.message === 'ok') {
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

  routeToHome() {
    this.router.navigate(['/userblog']);
  }

  getUrl() {
    // Load the HTML content using cheerio
    const $ = cheerio.load(this.blog_content);

    // Find the iframe element
    const iframe = $('iframe');

    // Check if an iframe element is found
    if (iframe.length > 0) {
      // Get the value of the src attribute
      this.blog_content = this.blog_content.replace(iframe.toString(), '');
      const srcValue = iframe.attr('src');
      return srcValue || null;
    } else {
      // Return null if no iframe element is found
      return null;
    }
  }
}
