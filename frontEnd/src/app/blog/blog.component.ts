import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { LikeObj, CountLike, LikeData, Post, PostData } from 'src/DataTypes';
import { AuthService } from '../Services/Authentication/auth.service';
import { CommentsModule } from "../comments/comments.module";
@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    standalone: true,
    imports: [IonicModule, MatToolbarModule, CommonModule, ToolbarComponent, CommentsModule]
})
export class BlogComponent implements OnInit, AfterViewInit {
  authenticate: AuthService = inject(AuthService);

  id!: string;
  post!: Post;
  time: String = '';
  content: string | SafeHtml = '';
  url: any = null;
  likes: number = 0;
  dislikes: number = 0;
  currentUserId : string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private api: APIService,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];
  }
  ngAfterViewInit() {
    this.api.getSpecificPost(this.id).subscribe({
      next: (response) => {
        console.log();
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.post = (response.data as PostData).post as Post;
          this.content = this.sanitizer.bypassSecurityTrustHtml(
            this.post.content
          ); //sanitizing dom to prevent angular to stop external link -- angular does so to prevent xss attack
          this.time = new Date(this.post.time).toDateString().toString();
          this.likes = this.post.likeCount;
          this.dislikes = this.post.dislikeCount;
        }
      },
      error: (err) => {
        this.toast.error('Error loading post');
        console.log(err);
      },
    });
  }
  sendLikeDislike(val: string) {
    let reactionValues: LikeObj = { id: this.id, value: val };
    this.api.likedislike(reactionValues).subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          const likevals = (response.data as LikeData).countLike as CountLike;
          this.likes = likevals.likeCount;
          this.dislikes = likevals.dislikeCount;
        }
      },
      error: (err) => {
        this.toast.error('Error');
        console.log(err);
      },
    });
  }
  like() {
    if (!this.authenticate.loggedIn) {
      this.toast.warning('Sign in to like');
      return;
    }
    let val = 'like';
    this.sendLikeDislike(val);
  }
  dislike() {
    if (!this.authenticate.loggedIn) {
      this.toast.warning('Sign in to dislike');
      return;
    }
    let val = 'dislike';
    this.sendLikeDislike(val);
  }

  openProfilePage(){
    const id = this.id;
    this.router.navigate(['/profile'], { queryParams: { id } });
  }
}
