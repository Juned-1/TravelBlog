import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Quill, { RangeStatic } from 'quill';
import { ModalController } from '@ionic/angular';
import { PreviewComponent } from './preview/preview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import * as cheerio from 'cheerio';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { Post, PostData, sendPostBulk } from 'src/DataTypes';
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
        ['link', 'image', 'video', 'imageLink'],
        //['imageLink'],
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
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private api: APIService,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.api.authorise().subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        if (data.status === 'success' && data.message === 'Token verified') {
          this.isLoggedIn = true;
        }
      },
      (err) => {
        localStorage.removeItem('travel-blog');
        this.isLoggedIn = false;
      }
    );
    this.initQuill();
  }
  initQuill() {
    let container = document.getElementById('editor');
    this.editor = new Quill(container!, this.options);
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
    //let url = this.getUrl();

    let postDetails : sendPostBulk = {
      title,
      subtitle,
      content: this.content,
      //url,
    };
    if (this.edit == true) {
      this.editBlog(postDetails);
      return;
    }

    this.api.post(postDetails).subscribe(
      (response) => {
        //console.log(response);
        if ('status' in response && response.status === 'success') {
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

  routeToHome() {
    this.router.navigate(['/userblog']);
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
  /*imageLinkButton() {
    const customButton = this.editor
      .getModule('toolbar')
      .container.querySelector('.ql-imageLink');
    customButton.innerHTML = `<ion-icon name="image-sharp"></ion-icon>`;
    let container: HTMLElement | null = null; // Container for input field and save button

    // Function to create and position the container
    const createContainer = () => {
      container = document.createElement('div');
      container.classList.add('image-link-container');
      container.classList.add('ql-tooltip');
      container.classList.add('ql-editing');

      container.innerHTML = `
        <input type="text" class="image-link-input" placeholder="Insert image link..." />
        <button class="save-button">Save</button>
      `;
      const inputField = container.querySelector(
        '.image-link-input'
      ) as HTMLInputElement;
      const saveButton = container.querySelector(
        '.save-button'
      ) as HTMLButtonElement;

      // Function to handle the save button click
      saveButton.addEventListener('click', () => {
        const imageLink = inputField.value.trim();
        // Insert the image link into the editor at the cursor position or implement your logic here
        if (imageLink !== '') {
          this.editor.clipboard.dangerouslyPasteHTML(
            '<img src="' + imageLink + '" />',
            'user'
          );
        }
        hideContainer();
      });
      // Get the current selection and its position
      const selection = window.getSelection();
      const editor = document.getElementById('editor')?.appendChild(container);
      if (selection && selection.anchorNode) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Position the container below the caret
        container.style.position = 'absolute';
        container.style.top = rect.bottom + window.pageYOffset + 'px';
        container.style.left = rect.left + window.pageXOffset + 'px';
      } else {
        // If no caret, position the container at the end of the editor content
        const editor = document.getElementById('editor');
        if (editor) {
          const editorRect = editor.getBoundingClientRect();
          container.style.position = 'absolute';
          container.style.top = editorRect.bottom + window.pageYOffset + 'px';
          container.style.left = editorRect.left + window.pageXOffset + 'px';
        }
      }
      editor?.appendChild(container);
      inputField.focus();
      document.addEventListener('click', handleOutsideClick);
    };
    // Function to hide and remove the container
    const hideContainer = () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
        container = null;
        document.removeEventListener('click', handleOutsideClick);
      }
    };
    // Function to handle clicks outside the container
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        container &&
        !container.contains(target) &&
        !customButton.contains(target)
      ) {
        hideContainer();
      }
    };
    customButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      //console.log('Hello from custom component');
      if (!container) {
        createContainer();
      }
    });
  }*/
}
