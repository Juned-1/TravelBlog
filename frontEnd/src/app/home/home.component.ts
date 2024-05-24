import { Component, OnInit, OnDestroy } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogCardHomeComponent } from './blog-card-home/blog-card-home.component';
import { blog, data } from '../../DataTypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ToolbarComponent, BlogCardHomeComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  posts!: blog[];
  page: number = 1;
  emptyPosts = false;

  imgs!: NodeListOf<HTMLImageElement>;
  dots!: NodeListOf<HTMLImageElement>;
  currentImg = 0; // index of the first image
  interval = 3000; // duration(speed) of the slide
  timer!: number;
  constructor(
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.imgs = document.querySelectorAll('.slider img');
    this.dots = document.querySelectorAll('.dot');
    this.timer = setInterval(this.changeSlide.bind(this), this.interval);
    console.log(this.imgs);
    console.log(this.dots);
    this.loadInitPost();
  }
  changeSlide(n: number) {
    for (let i = 0; i < this.imgs.length; i++) {
      // reset
      this.imgs[i].style.opacity = '0';
      this.dots[i].className = this.dots[i].className.replace(' active', '');
    }

    this.currentImg = (this.currentImg + 1) % this.imgs.length; // update the index number

    if (n != undefined) {
      clearInterval(this.timer);
      this.timer = setInterval(this.changeSlide.bind(this), this.interval);
      this.currentImg = n;
    }

    this.imgs[this.currentImg].style.opacity = '1';
    this.dots[this.currentImg].className =
      this.dots[this.currentImg].className + ' active';
  }
  loadInitPost() {
    this.api.getPost(this.page)?.subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.posts = (response.data as data).blogs as blog[];

          if (this.posts.length === 0) {
            this.emptyPosts = true;
          } else {
            this.emptyPosts = false;
          }

          for (let post of this.posts) {
            post.time = new Date(post.time).toDateString().toString();
            // Extract the first image URL from post.post_content
            let imageURL = this.extractFirstImageURL(post.content);
            if (imageURL === null) {
              imageURL = '../../assets/travelImage/no-image.jpg';
            }
            imageURL = (
              this.sanitizer.bypassSecurityTrustResourceUrl(imageURL) as any
            ).changingThisBreaksApplicationSecurity;
            post.imageURL = imageURL;
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  extractFirstImageURL(postContent: string): string | null {
    const regex = /<img src="(.*?)"/g;
    const match = regex.exec(postContent);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  openBlog(title: string, id: string) {
    title = title.toLowerCase();
    title = title.replace(/ /g, '-');
    this.router.navigate([`blogdetails/${title}`], { queryParams: { id } });
  }

  onIonInfinite(ev: any) {
    this.page++;
    this.api.getPost(this.page)?.subscribe(
      (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          let morePost = (response.data as data).blogs as blog[];
          for (let post of morePost) {
            post.time = new Date(post.time).toDateString().toString();

            // Extract the first image URL from post.post_content
            let imageURL = this.extractFirstImageURL(post.content);
            if (imageURL === null) {
              imageURL = '../../assets/travelImage/no-image.jpg';
            }
            imageURL = (
              this.sanitizer.bypassSecurityTrustResourceUrl(imageURL) as any
            ).changingThisBreaksApplicationSecurity;
            post.imageURL = imageURL;
          }
          this.posts.push(...morePost);
        }
      },
      (err) => {
        console.log(err);
      }
    );

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 300);
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
