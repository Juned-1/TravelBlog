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
  page: number = 1;
  defaultProfileImage = '../../assets/2.png';

  constructor(
    private router: Router,
    private api: APIService,
    private myProfileService: MyprofileService
  ) {}

  ngOnInit() {
    this.myProfileDetails = this.myProfileService.myProfileDetails;
    this.myProfileDetails[0].profilePicture = this.defaultProfileImage;

    const id = localStorage.getItem('currentUserId');
    this.loggedUserId = id === null ? '' : id;

    this.myProfileService.getMyProfileDetails();
    this.myProfileService.getMyBio();
    this.getMyFollowingList();
    this.getMyFollowerList();
    this.getMySocialLinks();
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
        let followingList: Persons[] = (response as ApiResponseFollowing).data
          .followings;
        followingList = followingList.map((obj) => {
          // Assign new key
          obj['id'] = obj['followingId'];
          // Delete old key
          delete obj['followingId'];
          return obj;
        });

        followingList.forEach((person) => {
          if (person.profilePhoto !== null) {
            const mimeType = 'image';
            const photoContent = person.profilePhoto;
            const imageDataUrl = `data:${mimeType};base64,${photoContent}`;
            person.profilePhoto = imageDataUrl;
          }
          else{
            person.profilePhoto = this.defaultProfileImage;
          }
        });

        this.myProfileDetails[0].followingList = followingList;
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
        let followerList: Persons[] = (response as ApiResponseFollower).data
          .followers;

        followerList = followerList.map((obj) => {
          // Assign new key
          obj['id'] = obj['followerId'];
          // Delete old key
          delete obj['followerId'];
          return obj;
        });

        followerList.forEach((person) => {
          if (person.profilePhoto !== null) {
            const mimeType = 'image';
            const photoContent = person.profilePhoto;
            const imageDataUrl = `data:${mimeType};base64,${photoContent}`;
            person.profilePhoto = imageDataUrl;
          }
          else{
            person.profilePhoto = this.defaultProfileImage;
          }
        });

        this.myProfileDetails[0].followerList = followerList;
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
    //Unfollow a user
    this.api.followUnfollow(id).subscribe({
      next: (response) => {
        // Find index of object with the specified id
        const indexToRemove = this.myProfileDetails[0].followingList.findIndex(
          (obj) => obj.id === id
        );
        // If index is found, remove the object
        if (indexToRemove !== -1) {
          this.myProfileDetails[0].followingList.splice(indexToRemove, 1);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  remove(e: any) {
    const id = e.srcElement.id;

    this.api.removeFollower(id).subscribe({
      next: (reponse) => {
        this.myProfileDetails[0].followerList =
          this.myProfileDetails[0].followerList.filter((person) => {
            return person.id !== id;
          });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
