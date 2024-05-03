import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import { blogs, data } from 'src/DataTypes';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  id: string = '';

  constructor(
    private router: Router,
    private api: APIService,
  ) {}

  ngOnInit() {
    this.list = this.followingList;

    const id = localStorage.getItem('currentUserId');
    this.loggedUserId = id === null ? '' : id;

    this.getMyProfileDetails();
    this.getMyFollowerList();
    this.getMyFollowingList();
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
  getMyFollowerList() {
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
  getMyFollowingList(){}
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
  toggleProfile(){
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
}