import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { BlogCardHomeComponent } from '../home/blog-card-home/blog-card-home.component';
import {
  ApiResponseFollower,
  ApiResponseFollowing,
  Persons,
  ProfileDetails,
  blog,
  data,
} from 'src/DataTypes';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BlogCardHomeComponent],
})
export class ProfileComponent implements OnInit {
  defaultProfileImage = '../../assets/2.png';

  profileDetails: ProfileDetails[] = [
    {
      firstName: '',
      lastName: '',
      fullName: '',
      gender: '',
      id: '',
      profilePicture: '../../assets/2.png',
      followingList: [],
      followerList: [],
      bio: '',
      email: '',
      links: {
        facebook: '',
        linkedin: '',
        instagram: '',
        twitter: '',
      },
      noOfPosts: 0,
      totalPostRead: 0,
      lockProfile: true,
      dob: new Date().toDateString(),
    },
  ];

  following!: boolean;
  loggedUserId!: string;

  posts!: blog[];
  page: number = 1;

  constructor(
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    const id = localStorage.getItem('currentUserId');
    this.loggedUserId = id === null ? '' : id;

    this.profileDetails[0].id = this.route.snapshot.queryParams['id'];

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
      this.api.getSocialLinks(item, this.profileDetails[0].id).subscribe({
        next: (response) => {
          if (
            'status' in response &&
            response.status === 'success' &&
            'data' in response
          ) {
            if (
              response.data.social.socialAccountLink != null ||
              response.data.social.socialAccountLink != ''
            ) {
              this.profileDetails[0].links[item] =
                response.data.social.socialAccountLink;
            }
          }
        },
        error: (error) => {},
      });
    });
  }
  getProfileDetails() {
    this.api.getUserDetails(this.profileDetails[0].id).subscribe({
      next: (response) => {
        //console.log(response);
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
          if (userDetails.dob === null) {
            this.profileDetails[0].dob = 'not set';
          } else {
            const dob = new Date(userDetails.dob);
            console.log(dob);
            const year = dob.getFullYear();
            const mon = dob.getMonth() + 1;
            const day = dob.getDate();
            const date = day + '/' + mon + '/' + year;
            this.profileDetails[0].dob = date;
          }
          this.profileDetails[0].email = userDetails.email;
          this.profileDetails[0].firstName = userDetails.firstName;
          this.profileDetails[0].lastName = userDetails.lastName;
          this.profileDetails[0].fullName =
            this.profileDetails[0].firstName +
            ' ' +
            this.profileDetails[0].lastName;
          this.following = userDetails.following;
          this.profileDetails[0].lockProfile = userDetails.lockProfile;

          this.profileDetails[0].totalPostRead = userDetails.totalPostRead;
          if (this.profileDetails[0].totalPostRead === null)
            this.profileDetails[0].totalPostRead = 0;
        }
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }

  getPosts() {
    this.api.getPostforProfile(this.profileDetails[0].id).subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.posts = (response.data as data).blogs as blog[];
          for (let post of this.posts) {
            this.profileDetails[0].noOfPosts =
              this.profileDetails[0].noOfPosts + 1;
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
        //console.log(err);
      },
    });
  }

  getFollowingList() {
    this.api.getFollowingList(this.profileDetails[0].id).subscribe({
      next: (response) => {
        //console.log('following list', response);
        this.profileDetails[0].followingList = (
          response as ApiResponseFollowing
        ).data.followings;

        this.profileDetails[0].followingList =
          this.profileDetails[0].followingList.map((obj) => {
            obj['selfFollow'] =
              obj['followingId'] === this.loggedUserId ? false : true;

            // Assign new key
            obj['id'] = obj['followingId'];
            // Delete old key
            delete obj['followingId'];
            return obj;
          });

        this.profileDetails[0].followingList.forEach((person) => {
          if (person.profilePhoto !== null) {
            const mimeType = 'image';
            const photoContent = person.profilePhoto;
            const imageDataUrl = `data:${mimeType};base64,${photoContent}`;
            person.profilePhoto = imageDataUrl;
          } else {
            person.profilePhoto = this.defaultProfileImage;
          }
        });
        // this.list = this.profileDetails[0].followingList;
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }
  getFollowerList() {
    this.api.getFollowerList(this.profileDetails[0].id).subscribe({
      next: (response) => {
        //console.log('follower list', response);
        //console.log(this.loggedUserId);

        this.profileDetails[0].followerList = (
          response as ApiResponseFollower
        ).data.followers;
        this.profileDetails[0].followerList =
          this.profileDetails[0].followerList.map((obj) => {
            obj['selfFollow'] =
              obj['followerId'] === this.loggedUserId ? false : true;

            // Assign new key
            obj['id'] = obj['followerId'];
            // Delete old key
            delete obj['followerId'];
            return obj;
          });

        this.profileDetails[0].followerList.forEach((person) => {
          if (person.profilePhoto !== null) {
            const mimeType = 'image';
            const photoContent = person.profilePhoto;
            const imageDataUrl = `data:${mimeType};base64,${photoContent}`;
            person.profilePhoto = imageDataUrl;
          } else {
            person.profilePhoto = this.defaultProfileImage;
          }
        });
      },
      error: (error) => {
        //console.log(error);
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
        //console.log(err);
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
    this.api.followUnfollow(this.profileDetails[0].id).subscribe({
      next: (response) => {
        this.following = !this.following;
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }

  followUnfollow(e: any) {
    //follow or unfollow profiles following or followers
    const id = e.srcElement.id;

    this.api.followUnfollow(id).subscribe({
      next: (response) => {
        this.profileDetails[0].followingList.forEach((person) => {
          if (person.id === id) {
            person.following = !person.following;
          }
        });

        this.profileDetails[0].followerList.forEach((person) => {
          if (person.id === id) {
            person.following = !person.following;
          }
        });
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }
  gotoChat() {
    const id = this.profileDetails[0].id;
    // this.router.navigate(['/chat'], { queryParams: { id } }).then(() => {
    //   window.location.reload();
    // });
    this.api.getAllConversation().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.chatService.conversations.length = 0;
          response.data.conversation.forEach((conversation: Conversation) => {
            this.chatService.conversations.push(conversation);
          });

          let found = false;
          this.chatService.conversations.forEach((conversation) => {
            const userId = conversation.participants[0].userId;
            if (userId === this.profileDetails[0].id) {
              found = true;
            }
          });

          if (found) {
            this.router.navigate(['/chat'], { queryParams: { id } });
          } else {
            const id = this.profileDetails[0].id;
            this.api
              .createIndividualConversation({ recipientId: id })
              .subscribe(
                (response) => {
                  this.chatService.conversations.push(
                    response.data.conversation[0]
                  );

                  this.router.navigate(['/chat'], { queryParams: { id } });
                },
                (error) => {
                  //console.log(error);
                }
              );
          }
        }
      },
      error: (error) => {},
    });
  }
  getBio() {
    this.api.getBio(this.profileDetails[0].id).subscribe({
      next: (response) => {
        this.profileDetails[0].bio = response.data.bio;
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }
  gotoProfile(id: string) {
    if (id === this.loggedUserId) this.router.navigate(['/myprofile']);
    else this.router.navigate(['/profile'], { queryParams: { id } });
  }
}

interface Conversation {
  conversationId: string;
  conversationType: string;
  conversationName: string | null;
  createdAt: string;
  participants: Participant[];
}

interface Participant {
  userId: string;
  User: User;
}

interface User {
  firstName: string;
  lastName: string;
}
