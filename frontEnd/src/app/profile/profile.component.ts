import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import {
  ApiResponseFollower,
  ApiResponseFollowing,
  Persons,
  blog,
  data,
} from 'src/DataTypes';
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
  following!: boolean;
  profileId: string = '';
  loggedUserId!: string;
  fullName!: string;
  firstName = ''
  lastName = ''
  email = '';
  dob='';

  posts!: blog[];
  page: number = 1;
  noOfPost: number = 0;
  lock = false;
  bio: string = '';

  followingList: Persons[] = [];
  followerList: Persons[] = [];
  list: Persons[] = [];
  reads: number = 0;
  link: {
    facebook: string | null;
    linkedin: string | null;
    instagram: string | null;
    twitter: string | null;
  } = { facebook: null, linkedin: null, instagram: null, twitter: null };

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

    this.getProfileDetails();
    this.getFollowingList();
    this.getFollowerList();
    this.getPosts();
    this.getBio();
    this.getSocialLinks();
  }
  getSocialLinks() {
    const socialTypes = ['facebook', 'linkedin', 'instagram', 'twitter'];
    socialTypes.forEach((item) => {
      this.api.getSocialLinks(item, this.profileId).subscribe({
        next: (response) => {
          if (
            'status' in response &&
            response.status === 'success' &&
            'data' in response
          ) {
            if (response.data.social.socialAccountLink != null || response.data.social.socialAccountLink !='') {
              this.link[item] = response.data.social.socialAccountLink;
            }
          }
        },
        error: (error) => {
        },
      });
    });
  }
  getProfileDetails() {
    this.api.getUserDetails(this.profileId).subscribe({
      next: (response) => {
        console.log(response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          const userDetails = (
            response.data as {
              userDetails: {
                dob: string;
                email: string;
                firstName: string;
                gender: string;
                lastName: string;
                modification: string;
                following: boolean;
                lockProfile: boolean;
                totalPostRead: number;
              };
            }
          ).userDetails;
          this.email = userDetails.email;
          this.dob = userDetails.dob;
          this.firstName = userDetails.firstName;
          this.lastName = userDetails.lastName;
          this.fullName = this.firstName + ' ' + this.lastName;
          this.following = userDetails.following;
          this.lock = userDetails.lockProfile;

          this.reads = userDetails.totalPostRead;
          if (this.reads === null) this.reads = 0;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getPosts() {
    this.api.getPostforProfile(this.profileId).subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.posts = (response.data as data).blogs as blog[];
          for (let post of this.posts) {
            this.noOfPost = this.noOfPost + 1;
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

  getFollowingList() {
    this.api.getFollowingList(this.profileId).subscribe({
      next: (response) => {
        console.log('following list',response);
        this.followingList = (response as ApiResponseFollowing).data.followings;

        this.followingList = this.followingList.map((obj) => {
          obj['selfFollow'] =
            obj['followingId'] === this.loggedUserId ? false : true;

          // Assign new key
          obj['id'] = obj['followingId'];
          // Delete old key
          delete obj['followingId'];
          return obj;
        });
        this.list = this.followingList;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getFollowerList() {
    this.api.getFollowerList(this.profileId).subscribe({
      next: (response) => {
        console.log('follower list',response);
        console.log(this.loggedUserId);

        this.followerList = (response as ApiResponseFollower).data.followers;
        this.followerList = this.followerList.map((obj) => {
          obj['selfFollow'] =
            obj['followerId'] === this.loggedUserId ? false : true;

          // Assign new key
          obj['id'] = obj['followerId'];
          // Delete old key
          delete obj['followerId'];
          return obj;
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
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
    //Follow or Unfollow the profile
    this.api.followUnfollow(this.profileId).subscribe({
      next: (response) => {
        this.following = !this.following;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  followUnfollow(e: any) {
    //follow or unfollow profiles following or followers
    const id = e.srcElement.id;

    this.api.followUnfollow(id).subscribe({
      next: (response) => {
        this.followingList.forEach((person) => {
          if (person.id === id) {
            person.following = !person.following;
          }
        });
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
  getBio() {
    this.api.getBio(this.profileId).subscribe({
      next: (response) => {
        this.bio = response.data.bio;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
