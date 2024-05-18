import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import { ProfileDetails } from 'src/DataTypes';
import {
  ApiResponseFollower,
  ApiResponseFollowing,
  Persons,
} from 'src/DataTypes';
import { Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';

import { MyprofileService } from './myprofile.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BlogCardHomeComponent],
})
export class MyprofileComponent implements OnInit {
  myProfileDetails: ProfileDetails[] = [];

  loggedUserId!: string;
  fileName: string = '';
  file!: FileList;
  uploadingProfilePicture: boolean = false;
  segmentValue: string = 'default';

  page: number = 1;
  followingList: Persons[] = [];
  followerList: Persons[] = [];
  list: Persons[] = [];

  constructor(
    private router: Router,
    private api: APIService,
    private myProfileService: MyprofileService
  ) {}

  ngOnInit() {
    this.myProfileDetails = this.myProfileService.myProfileDetails;
    this.myProfileDetails[0].profilePicture = '../../assets/2.png';
    this.list = this.followingList;

    const id = localStorage.getItem('currentUserId');
    this.loggedUserId = id === null ? '' : id;

    // this.myProfileService.getMyProfileDetails();
    // this.myProfileService.getMyBio();
    this.getMyFollowingList();
    // this.getMyFollowerList();
    // this.getMySocialLinks();
    this.myProfileService.getMyProfilePicture();
  }
  getMySocialLinks() {
    const socialTypes = ['facebook', 'linkedin', 'instagram', 'twitter'];
    socialTypes.forEach((item) => {
      this.api.getMySocialLinks(item).subscribe({
        next: (response) => {
          const link = response.data.social.socialAccountLink;
          if (link !== null) this.myProfileDetails[0].links[item] = link;
        },
        error: (error) => {
          console.log(error);
        },
      });
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
    this.myProfileService.uploadProfilePicture(this.file);
    this.cancel();
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
          this.myProfileDetails[0].lockProfile =
            !this.myProfileDetails[0].lockProfile;
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
