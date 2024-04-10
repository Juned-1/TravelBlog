import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APIService } from 'src/apiservice.service';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import { SearchParameter, blogs, data } from 'src/DataTypes';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../Services/Authentication/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule, BlogCardHomeComponent],
})
export class ToolbarComponent implements OnInit {

  // @Input() isLoggedIn: boolean = false;
  authService:AuthService = inject(AuthService);

  user: string|null = this.authService.getUser();
  searchKeyword: string = '';
  searchResults!: blogs[];
  showSearchResults: boolean = false;
  constructor(
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.authService.checkLoggedIn();
  }
  LogIn() {
    this.router.navigate(['/login']);
  }
  Logout() {
    this.api.logout().subscribe(
      (response) => {
        localStorage.removeItem('travel-blog');
      },
      (err) => {
        console.log(err.error.message);
      }
    );
    this.authService.loggedIn = false;
    this.router.navigate(['/']);
  }
  signup() {
    this.router.navigate(['/signup']);
  }
  routeToHome() {
    this.router.navigate(['/']);
  }
  routeToMyBlogs() {
    this.router.navigate(['/userblog']);
  }
  handleChange(e: any) {
    console.log('ionChange fired with value: ' + e.detail.value);
    if (e.detail.value == 'logout') this.Logout();
    if (e.detail.value == 'login') this.LogIn();
    if (e.detail.value == 'signup') this.signup();
    if (e.detail.value == 'myblogs') this.routeToMyBlogs();
  }
  routeToProfile() {
    this.router.navigate(['/myprofile']);
  }
  openBlog(id: string) {
    this.router.navigate(['/blogdetails'], { queryParams: { id } });
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
  onSearch(searchTerm: any) {
    // Do something with the search term
    this.searchKeyword = searchTerm.target.value;
    if (this.searchKeyword === '') {
      this.showSearchResults = false;
    } else {
      this.showSearchResults = true;
    }

    let parameter: SearchParameter = {
      page: 1,
      title: this.searchKeyword,
      //subtitle : 'W'
    };
    this.api.searchPost(parameter).subscribe((response) => {
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

