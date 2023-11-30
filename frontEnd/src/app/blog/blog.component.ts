import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule,ToolbarComponent]
})
  export class BlogComponent  implements OnInit {
  post: any = {
    "title": "Sample Blog Post",
    "subtitle": "A subtitle for the blog post",
    "author": "John Doe",
    "date": "November 11, 2023",
    "picture": ["assets/images/sample-image.jpg"],
    "videos": ["https://www.youtube.com/embed/your-video-id"],
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ..."
  };

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    
  }
  ngOnInit() {}

  playVideo(videoUrl: string) {
    // const trustedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    // window.open(trustedUrl.changingThisBreaksApplicationSecurity, '_system');
  }
}
