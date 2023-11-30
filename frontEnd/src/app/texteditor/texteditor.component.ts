import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Quill from 'quill';
import { ModalController } from '@ionic/angular';
import { PreviewComponent } from './preview/preview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.scss'],
  standalone: true,
  imports: [IonicModule, PreviewComponent],
})
export class TexteditorComponent implements OnInit {
  linkCount: number = 0;
  maxLinks: number = 5;
  imageCount: number = 0;
  maxImage: number = 5;
  videoCount: number = 0;
  maxVideo: number = 5;
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
  blog_content: string = "";
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private api : APIService,
    private toast : ToastrService
  ) {}
  ngOnInit() {
    let container = document.getElementById('editor');
    this.editor = new Quill(container!, this.options);
    let toolbar = this.editor.getModule('toolbar');
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
    console.log(this.blog_content);
    let title = this.getTitle();
    console.log(this.blog_content);
    let subtitle = this.getSubTitle();
    let postDetails = {
      title,
      subtitle,
      post : this.blog_content,
    }
    this.api.post(postDetails).subscribe((response) => {
      if('message' in response && response.message === 'ok'){
        this.toast.success("Posted successfully");
        this.router.navigate(["/userblog"]);
      }
    }, (err) => {
        this.toast.error("Post unsuccessful");
        console.log(err);
    });
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
  getTitle(){
    let regTitle = /<h[1-6][^>]*>.*?<\/h[1-6]>/g;
    const content = this.blog_content;
    let match;
    let ListOfHeadings : any = [];
    while ((match = regTitle.exec(content)) !== null) {
      ListOfHeadings.push(match);
    }
    let val = '';
    if(ListOfHeadings.length !== 0){
      val = ListOfHeadings[0][0];
      this.blog_content = content.replace(val,"");
      val = val.replace(/<(\/)?(?:b|i|u|s|span|sub|sup|h[1-6]|em)[^>]*>/g, '');
    }
    return val;
  }
  getSubTitle(){
    let regTitle = /<h[1-6][^>]*>.*?<\/h[1-6]>/g;
    let content = this.blog_content;
    let match;
    let ListOfHeadings : any = [];
    while ((match = regTitle.exec(content)) !== null) {
      ListOfHeadings.push(match);
    }
    let val = '';
    if(ListOfHeadings.length !== 0){
      console.log(ListOfHeadings);
      val = ListOfHeadings[0][0];
      this.blog_content = content.replace(val,"");
      val = val.replace(/<(\/)?(?:b|i|u|s|span|sub|sup|h[1-6]|em)[^>]*>/g, '');
    }
    return val;
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
}