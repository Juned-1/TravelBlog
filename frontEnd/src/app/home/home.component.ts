import { Component, OnInit, Input } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APIService } from 'src/apiservice.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogCardHomeComponent } from './blog-card-home/blog-card-home.component';
import {SearchParameter, blogs, data} from '../../DataTypes'
import { SearchService } from '../search.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MatToolbarModule,
    CommonModule,
    ToolbarComponent,
    BlogCardHomeComponent,
  ],
})
export class HomeComponent implements OnInit {
  searchInput: string='';
  slideIndex: number = 0;
  posts!: blogs[];
  isLoggedIn = false;
  timeoutid: any = 0;
  page : number = 1;
  // blogCount = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private searchKeyword: SearchService,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.showSlides();
    console.log('On Init');
    this.api.authorise().subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        console.log(data);
        if (data.status === 'success' && data.message === 'Token verified') {
          this.isLoggedIn = true;
        }
      },
      (err) => {
        localStorage.removeItem('travel-blog');
        this.isLoggedIn = false;
      }
    );
  }

  ngAfterViewInit() {
    this.api.getPost(this.page)?.subscribe(
      (response) => {
        if ('status' in response && response.status === 'success' && 'data' in response) {
          this.posts = (response.data as data).blogs as blogs[];
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
      (err) => {
        console.log(err);
      }
    );
  }

  // goToEditor() {
  //   this.router.navigate(['/texteditor']);
  // }

  extractFirstImageURL(postContent: string): string | null {
    const regex = /<img src="(.*?)"/g;
    const match = regex.exec(postContent);
    if (match) {
      console.log(match[1]);
      return match[1];
    } else {
      return null;
    }
  }

  openBlog(id: string) {
    this.router.navigate(['/blogdetails'], { queryParams: { id } });
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
    //console.log(this.page)
    this.api.getPost(this.page)?.subscribe(
      (response) => {
        if ('status' in response && response.status === 'success' && 'data' in response) {
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
  search(){
    
  }
}
