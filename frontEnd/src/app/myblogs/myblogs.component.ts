import {
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MyblogsBlogCardComponent } from './myblogs-blog-card/myblogs-blog-card.component';
import { SearchParameter } from 'src/DataTypes';
import { blogs, data } from 'src/DataTypes';
@Component({
  selector: 'app-myblogs',
  templateUrl: 'myblogs.component.html',
  styleUrls: ['myblogs.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MatToolbarModule,
    CommonModule,
    ToolbarComponent,
    MyblogsBlogCardComponent,
  ],
})
export class MyblogsComponent implements OnInit, AfterViewInit {
  posts!: blogs[];
  isSetToolbar: any;
  page: number = 1;
  searchKeyword: string = '';
  searchResults: blogs[] = [];
  showSearchResult: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
      this.loadInitPost();
  }
  ngAfterViewInit() {}
  loadInitPost() {
    this.api.getMyPost(this.page).subscribe(
      (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.posts = (response.data as data).blogs as blogs[];
          for (let post of this.posts) {
            post.time = new Date(post.time).toDateString().toString();

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
  extractFirstImageURL(postContent: string): string | null {
    const regex = /<img src="(.*?)"/g;
    const match = regex.exec(postContent);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  onIonInfinite(ev: any) {
    this.page++;
    //console.log(this.page)
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

  openBlog(id: string) {
    this.router.navigate(['/blogdetails'], { queryParams: { id } });
  }
  openEditor() {
    this.router.navigate(['/texteditor']);
  }
  trackByPostId(index: number, post: blogs): string {
    return post.id; // Assuming 'id' is the unique identifier for posts
  }
  onDeletePost(deletePostId: string) {
    //find and delete post that from post array
    this.posts = this.posts.filter((post) => post.id !== deletePostId);
  }
  onSearch(searchTerm: any) {
    this.searchKeyword = searchTerm.target.value;
    if (this.searchKeyword === '') {
      this.showSearchResult = false;
      return;
    } else {
      this.showSearchResult = true;
    }

    let parameter: SearchParameter = {
      page: 1,
      title: this.searchKeyword,
      //subtitle : 'W'
    };
    this.api
      .searchUserPost(parameter)
      .subscribe((response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.searchResults = (response.data as data).blogs as blogs[];
          console.log(this.searchResults);
          for (let post of this.searchResults) {
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
      });
  }
}

