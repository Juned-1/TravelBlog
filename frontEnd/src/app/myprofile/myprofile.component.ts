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
import { error } from 'console';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BlogCardHomeComponent],
})
export class MyprofileComponent implements OnInit {
  loggedUserId!: string;
  name!: string;
  fileName: string = '';
  file!: FileList;
  uploadingProfilePicture: boolean = false;
  segmentValue: string = 'default';
  lock = false;

  posts!: blog[];
  page: number = 1;
  followingList: Persons[] = [];
  followerList: Persons[] = [];
  list: Persons[] = [];
  id: string = '';
  bio: string = '';
  link: {
    facebook: string;
    linkedin: string;
    instagram: string;
    twitter: string;
  } = { facebook: '', linkedin: '', instagram: '', twitter: '' };
  noOfPosts: number = 0;
  reads: number = 0;

  constructor(private router: Router, private api: APIService) {}

  ngOnInit() {
    this.list = this.followingList;

    const id = localStorage.getItem('currentUserId');
    this.loggedUserId = id === null ? '' : id;

    this.getMyProfileDetails();
    this.getMyFollowingList();
    this.getMyFollowerList();
    this.getMyBio();
    this.getMySocialLinks();
  }
  getMySocialLinks() {
    const socialTypes = ['facebook', 'linkedin', 'instagram', 'twitter'];
    socialTypes.forEach((item) => {
      this.api.getMySocialLinks(item).subscribe({
        next: (response) => {
          this.link[item] = response.data.social.socialAccountLink;
          if (this.link[item] == null)
            this.link[item] = `https://www.${item}.com/`;
        },
        error: (error) => {
          this.link[item] = `https://www.${item}.com/`;
        },
      });
    });
  }
  getMyBio() {
    this.api.getMyBio().subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.bio = response.data.bio;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getMyProfileDetails() {
    this.api.getMyDetails().subscribe({
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
                lockProfile: boolean;
                totalPostRead: number;
                numberOfPost:number;
              };
            }
          ).userDetails;

          this.name = userDetails.firstName + ' ' + userDetails.lastName;
          this.lock = userDetails.lockProfile;
          this.reads = userDetails.totalPostRead;
          this.noOfPosts = userDetails.numberOfPost;
          if (this.reads === null) this.reads = 0;
          if(this.noOfPosts === null) this.noOfPosts = 0;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getMyFollowingList() {
    this.api.getMyFollowingList().subscribe({
      next: (response) => {
        this.followingList = (response as ApiResponseFollowing).data.followings;
        this.followingList = this.followingList.map((obj) => {
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
  getMyFollowerList() {
    this.api.getMyFollowerList().subscribe({
      next: (response) => {
        this.followerList = (response as ApiResponseFollower).data.followers;

        this.followerList = this.followerList.map((obj) => {
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
  gotoEditProfile() {
    this.router.navigate(['/editprofile']);
  }
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
    this.api.uploadProfilePhoto(this.file).subscribe({
      next: (response) => {
        console.log('Hello');
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
    if (this.segmentValue === 'default') this.list = this.followingList;
    if (this.segmentValue === 'segment') this.list = this.followerList;
  }
  toggleProfile() {
    this.api.toggleProfile().subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.lock = !this.lock;
          console.log(response);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  unfollowOrRemove(e: any) {
    const id = e.srcElement.id;
    if (this.segmentValue == 'default') {
      //Unfollow a user
      this.api.followUnfollow(id).subscribe({
        next: (response) => {
          // Find index of object with the specified id
          const indexToRemove = this.followingList.findIndex(
            (obj) => obj.id === id
          );
          // If index is found, remove the object
          if (indexToRemove !== -1) {
            this.followingList.splice(indexToRemove, 1);
          }
          this.list = this.followingList;
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      //remove a user
      this.api.removeFollower(id).subscribe({
        next: (reponse) => {
          this.followerList = this.followerList.filter((person) => {
            return person.id !== id;
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
