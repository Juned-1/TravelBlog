import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Quill from 'quill';
import { ModalController } from '@ionic/angular';
import { PreviewComponent } from './preview/preview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from '../myblogs/dummyData';

@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.scss'],
  standalone: true,
  imports: [IonicModule, PreviewComponent],
})
export class TexteditorComponent implements OnInit {
  isSetToolbar: any;
  linkCount: number = 0;
  maxLinks: number = 1;
  imageCount: number = 0;
  maxImage: number = 1;
  videoCount: number = 0;
  maxVideo: number = 1;
  editor!: Quill;
  options = {
    modules: {
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
    placeholder: 'HEADING\nSUB-HEADING\nContent',
    theme: 'snow',
  };
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    let container = document.getElementById('editor');
    this.editor = new Quill(container!, this.options);
    let toolbar = this.editor.getModule('toolbar');
    if (this.router.url !== '/texteditor') {
      this.isSetToolbar = true;
    } else {
      this.isSetToolbar = false;
    }
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
    console.log(this.editor.root.innerHTML);
    //Write on dummy JS file
    // "title": "Sample Blog Post",
    // "subtitle": "A subtitle for the blog post",
    // "author": "John Doe",
    // "date": "November 11, 2023",
    // "picture": ["assets/images/sample-image.jpg"],
    // "videos": ["https://www.youtube.com/embed/your-video-id"],
    // "content":
    const post = {

    }
    data.unshift(this.parseContent(this.editor.root.innerHTML));
    this.routeToHome();
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
    //console.log(this.editor.root.innerHTML);
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
    this.router.navigate(['/myblogs']);
  }

 parseContent(htmlString: string): {
    title: string;
    subtitle: string;
    author: string;
    date: string;
    picture: string[];
    videos: string[];
    content: string;
  } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
  
    // Initialize result object
    const result = {
      title: '',
      subtitle: '',
      author: 'John Doe', // Dummy author
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      picture: [],
      videos: [],
      content: '',
    };
  
    // Extract title, subtitle, and content
    const pElements = doc.querySelectorAll('p');
    if (pElements.length > 0) {
      result.title = this.capitalizeFirstLetter(pElements[0].textContent || '');
    }
  
    if (pElements.length > 1) {
      result.subtitle = pElements[1].textContent || '';
    }
  
    // Extract pictures and videos from the content
    for (let i = 2; i < pElements.length; i++) {
      const contentParagraph = pElements[i].textContent || '';
      result.content += contentParagraph;
  
      // Extract pictures
      const pictureMatches = contentParagraph.match(/<img.*?src=["'](.*?)["']/g);
      if (pictureMatches) {
        // result.picture.push(pictureMatches.map(match => match.match(/src=["'](.*?)["']/)![1]));
      }
  
      // Extract videos
      const videoMatches = contentParagraph.match(/<iframe.*?src=["'](.*?)["']/g);
      if (videoMatches) {
        // result.videos = result.videos.concat(videoMatches.map(match => match.match(/src=["'](.*?)["']/)![1]));
      }
    }
  
    return result;
  }
  
  // Helper function to capitalize the first letter of a string
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
}