import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import { blogs, data } from 'src/DataTypes';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { error } from 'console';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BlogCardHomeComponent],
})
export class ProfileComponent implements OnInit {
  // constructor() { }

  // ngOnInit() {}
  fileName: string = '';
  file!: FileList;
  uploadingProfilePicture: boolean = false;

  @Input() self: boolean = true;
  posts!: blogs[];
  page: number = 1;
  persons: string[] = [
    'The Legend of Zelda',
    'Pac-Man',
    'Super Mario World',
    'Pac-Man',
    'Super Mario World',
  ];
  followerList: string[] = [];
  id: string = '';

  constructor(
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];
    console.log(this.id);

    this.api.getUserDetails(this.id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });

    if (this.id !== undefined) {
      this.self = false;
      this.getOthersProfiledetails(this.id);
      return;
    }

    const id = 'hello';
    this.api.getprofile(id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {},
    });

    this.id = this.route.snapshot.queryParams['id'];

    this.api.getPost(this.page)?.subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
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
      error: (err) => {
        console.log(err);
      },
    });

    this.getFollowerList();
  }

  getOthersProfiledetails(id: string) {
    console.log('On otherDetails function');
    console.log(id);
  }

  getFollowerList() {
    this.api.getMyFollowerList().subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          console.log(response);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openBlog(id: string) {
    this.router.navigate(['/blogdetails'], { queryParams: { id } });
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

  extractFirstImageURL(postContent: string): string | null {
    const regex = /<img src="(.*?)"/g;
    const match = regex.exec(postContent);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  gotoEditProfile() {
    this.router.navigate(['/editprofile']);
  }

  unfollow() {}

  uploadPofilePicture() {
    this.uploadingProfilePicture = true;
  }
  cancel() {
    this.uploadingProfilePicture = false;
  }
  onFileSelected(event: any) {
    this.file = event.srcElement.files;
    this.fileName = event.srcElement.files[0].name;
  }
  submit() {
    console.log('print');
    this.api.uploadProfilePhoto(this.file).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  toggleFollow() {
    this.api.followUnfollow(this.id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  gotoChat(){
    const id = this.id;
    this.router.navigate(['/chat'], { queryParams: { id } });
  }
}
