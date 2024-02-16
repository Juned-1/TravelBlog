import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { LikeObj, CountLike, LikeData, Post, PostData } from 'src/DataTypes';
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
  id!: string;
  post!: Post;
  time: String = '';
  content: string | SafeHtml = '';
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
        if (data.status === 'success' && data.message === 'Token verified') {
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
    console.log(this.id);
    this.api.getSpecificPost(this.id).subscribe(
      (response) => {
        console.log()
        if('status' in response && response.status === 'success' && 'data' in response){
          this.post = (response.data as PostData).post as Post;
          this.content = this.sanitizer.bypassSecurityTrustHtml(this.post.content); //sanitizing dom to prevent angular to stop external link -- angular does so to prevent xss attack
          this.time = new Date(this.post.time).toDateString().toString();
          this.likes = this.post.likeCount;
          this.dislikes = this.post.dislikeCount;
          //console.log(this.content);
        }


        // if (this.post.post_video_url) {
        //   this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        //     this.post.post_video_url
        //   );
        // }

      },
      (err) => {
        console.log('zingalala');
        this.toast.error('Error loading post');
        console.log(err);
      }
    );
  }
  sendLikeDislike(val: string) {
    let reactionValues : LikeObj = { id : this.id, value : val}
    this.api.likedislike(reactionValues).subscribe(
      (response) => {
        if('status' in response && response.status === 'success' && 'data' in response){
          const likevals = (response.data as LikeData).countLike as CountLike
          this.likes = likevals.likeCount;
          this.dislikes = likevals.dislikeCount;
        }
        // if ('message' in response && response.message === 'ok') {
        //   this.toast.success('success');
        //   this.ngAfterViewInit();
        // }
      },
      (err) => {
        this.toast.error('Error');
        console.log(err);
      }
    );
  }
  like() {
    if (!this.isLoggedIn) {
      this.toast.warning('Sign in to like');
      return;
    }
    let val = 'like';
    this.sendLikeDislike(val);
  }
  dislike() {
    if (!this.isLoggedIn) {
      this.toast.warning('Sign in to dislike');
      return;
    }
    let val = 'dislike';
    this.sendLikeDislike(val);
  }
  ngOnDestroy(): void {}
}
