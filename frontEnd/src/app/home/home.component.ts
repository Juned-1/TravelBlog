import { Component, OnInit, OnDestroy } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogCardHomeComponent } from './blog-card-home/blog-card-home.component';
import { blogs, data } from '../../DataTypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ToolbarComponent, BlogCardHomeComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  slideIndex: number = 0;
  posts!: blogs[];
  timeoutid: any = 0;
  page: number = 1;
  emptyPosts = false;
  constructor(
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.showSlides();
    this.loadInitPost();
  }

  loadInitPost() {
    this.api.getPost(this.page)?.subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.posts = (response.data as data).blogs as blogs[];

          if(this.posts.length===0){
            this.emptyPosts = true;
          }
          else{
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

  openBlog(title:string,id: string) {
    title = title.toLowerCase();
    title = title.replace(/ /g,"-");
    this.router.navigate([`blogdetails/${title}`], { queryParams: { id } });
  }

  showSlides(): void {
    let i: number;
    let slides: HTMLCollectionOf<Element> =
      document.getElementsByClassName('mySlides');

    for (i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = 'none';
    }

    this.slideIndex++;

    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }

    (slides[this.slideIndex - 1] as HTMLElement).style.display = 'block';
    this.timeoutid = setTimeout(() => this.showSlides(), 3000); // Change image every 3 seconds
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
          let morePost = (response.data as data).blogs as blogs[];
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
    clearTimeout(this.timeoutid);
  }
}
