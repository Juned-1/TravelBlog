import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import { blogs, data } from 'src/DataTypes';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BlogCardHomeComponent],
})
export class ProfileComponent implements OnInit {
  profileId: string = '';
  loggedUserId!: string;
  name!: string;

  posts!: blogs[];
  page: number = 1;

  segmentValue: string = 'default';
  followingList: string[] = [
    'Super Mario World',
    'Super Mario World',
    'Super Mario World',
    'Super Mario World',
    'Super Mario World',
    'Super Mario World',
  ];
  followerList: string[] = [
    'Pac-Man',
    'Pac-Man',
    'Pac-Man',
    'Pac-Man',
    'Pac-Man',
    'Pac-Man',
  ];
  list: string[] = [];

  constructor(
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = localStorage.getItem('currentUserId');
    this.loggedUserId = id === null ? '' : id;

    this.profileId = this.route.snapshot.queryParams['id'];

    this.list = this.followingList;

    this.getProfileDetails();

    this.getFollowerList();

    // this.api.getPost(this.page)?.subscribe({
    //   next: (response) => {
    //     if (
    //       'status' in response &&
    //       response.status === 'success' &&
    //       'data' in response
    //     ) {
    //       this.posts = (response.data as data).blogs as blogs[];
    //       for (let post of this.posts) {
    //         post.time = new Date(post.time).toDateString().toString();
    //         // Extract the first image URL from post.post_content
    //         let imageURL = this.extractFirstImageURL(post.content);
    //         if (imageURL === null) {
    //           imageURL = '../../assets/travelImage/no-image.jpg';
    //         }
    //         imageURL = (
    //           this.sanitizer.bypassSecurityTrustResourceUrl(imageURL) as any
    //         ).changingThisBreaksApplicationSecurity;
    //         post.imageURL = imageURL;
    //       }
    //     }
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }

  getProfileDetails() {
    this.api.getUserDetails(this.profileId).subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          console.log(response);
          const userDetails = (
            response.data as {
              userDetails: {
                dob: string;
                email: string;
                firstName: string;
                gender: string;
                lastName: string;
                modification: string;
              };
            }
          ).userDetails;

          this.name = userDetails.firstName + ' ' + userDetails.lastName;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getFollowerList() {
    this.api.getMyFollowerList().subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
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

  toggleFollow() {
    this.api.followUnfollow(this.profileId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  gotoChat() {
    const id = this.profileId;
    this.router.navigate(['/chat'], { queryParams: { id } });
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
    console.log(this.segmentValue);
    if (this.segmentValue === 'default') this.list = this.followingList;
    if (this.segmentValue === 'segment') this.list = this.followerList;
  }
}