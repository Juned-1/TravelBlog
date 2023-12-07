import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MatToolbarModule,
    CommonModule,
    ToolbarComponent,
    QuillModule,
  ],
})
export class BlogComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoggedIn = true;
  id!: number;
  post: any;
  time: String = '';
  content: string = '';
  url: any = null;
  likes: number = 0;
  dislikes: number = 0;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private api: APIService,
    private toast: ToastrService
  ) {}
  ngOnInit() {
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
    this.id = this.route.snapshot.queryParams['id'];
  }
  ngAfterViewInit() {
    //this.id = localStorage.getItem()
    this.api.getSpecificPost(this.id).subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        this.post = data.result[0];
        this.content = this.post.post_content;
        this.time = new Date(this.post.post_time).toDateString().toString();
        if (this.post.post_video_url) {
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.post.post_video_url
          );
        }
        this.likes = this.post.like_count;
        this.dislikes = this.post.dislike_count;
        console.log(this.likes, this.dislikes);
      },
      (err) => {
        this.toast.error('Error loading post');
        // console.log(err);
      }
    );
  }
  sendLikeDislike(val: boolean) {
    this.api.like_dislike({ post_id: this.id, val }).subscribe(
      (response) => {
        if ('message' in response && response.message === 'ok') {
          this.toast.success('success');
          this.ngAfterViewInit();
        }
      },
      (err) => {
        this.toast.error('Error');
        // console.log(err);
      }
    );
  }
  like() {
    if (!this.isLoggedIn) {
      this.toast.warning('Sign in to like');
      return;
    }
    let val = true;
    this.sendLikeDislike(val);
  }
  dislike() {
    if (!this.isLoggedIn) {
      this.toast.warning('Sign in to dislike');
      return;
    }
    let val = false;
    this.sendLikeDislike(val);
  }
  ngOnDestroy(): void {}
}
