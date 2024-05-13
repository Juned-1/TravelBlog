import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import {
  ApiResponseFollower,
  ApiResponseFollowing,
  Persons,
  blogs,
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

  posts!: blogs[];
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
  getMySocialLinks(){
    const socialTypes = ['facebook','linkedin','instagram','twitter'];
    socialTypes.forEach(item=>{
      this.api.getMySocialLinks(item).subscribe({
        next:(response)=>{
          console.log(response);
          this.link[item] = response.data.social.socialAccountLink;
          console.log(this.link);
        },
        error:error=>{
          console.log(error);
        }
      })
    })
  }
  getMyBio() {
    this.api.getMyBio().subscribe({
      next: (response) => {
        console.log('getmybio', response);
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
              };
            }
          ).userDetails;

          this.name = userDetails.firstName + ' ' + userDetails.lastName;
          this.lock = userDetails.lockProfile;
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
        console.log(response);
        this.followerList = (response as ApiResponseFollower).data.followers;

        this.followerList = this.followerList.map((obj) => {
          // Assign new key
          obj['id'] = obj['followingId'];
          // Delete old key
          delete obj['followingId'];
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
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
    console.log(this.segmentValue);
    if (this.segmentValue === 'default') this.list = this.followingList;
    if (this.segmentValue === 'segment') this.list = this.followerList;
  }
  toggleProfile() {
    this.api.toggleProfile(this.lock).subscribe({
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
  unfollowOrRemove(e: any) {
    if (this.segmentValue === 'default') {
      const id = e.srcElement.id;
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
      //remove a follower
      console.log('Remove not implemented');
    }
  }
}
