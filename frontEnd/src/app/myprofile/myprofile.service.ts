import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ProfileDetails } from 'src/DataTypes';
import { APIService } from 'src/apiservice.service';

@Injectable({
  providedIn: 'root',
})
export class MyprofileService {
  myProfileDetails: ProfileDetails[] = [
    {
      firstName: '',
      lastName: '',
      fullName: '',
      gender:'',
      id: '',
      profilePicture: '',
      followingList: [],
      followerList: [],
      bio: '',
      email:'',
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
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private api: APIService,
  ) {}

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
                totalPostRead: number;
                numberOfPost: number;
              };
            }
          ).userDetails;
          
          this.myProfileDetails[0].email = userDetails.email;
          this.myProfileDetails[0].fullName =
            userDetails.firstName + ' ' + userDetails.lastName;
          this.myProfileDetails[0].firstName = userDetails.firstName;
          this.myProfileDetails[0].lastName = userDetails.lastName;
          this.myProfileDetails[0].lockProfile = userDetails.lockProfile;
          if (userDetails.totalPostRead !== null)
            this.myProfileDetails[0].totalPostRead = userDetails.totalPostRead;
          if (userDetails.numberOfPost !== null)
            this.myProfileDetails[0].noOfPosts = userDetails.numberOfPost;
          if(userDetails.dob === null){
            this.myProfileDetails[0].dob = 'not set';
          }else{
            const dob = new Date(userDetails.dob);
            const year = dob.getFullYear();
            const mon = dob.getMonth()+1;
            const day = dob.getDate();
            const date =day+"/"+mon+"/"+year;
            this.myProfileDetails[0].dob = date;
          }
        }
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }

  uploadProfilePicture(files: FileList) {
    this.uploadPhotoApi(files).subscribe({
      next: (response) => {
        //console.log(response);
        const id: string = (response as any).data.album[0].photoId;

        const mimeType = (response as any).data.album[0].mimeType;
        const photoContent = (response as any).data.album[0].photoContent;
        const imageDataUrl = `data:${mimeType};base64,${photoContent}`;
        this.myProfileDetails[0].profilePicture = imageDataUrl;

        this.toast.success('Picture succesfully uploaded');
        this.activatePhoto(id, 'profile');
      },
      error: (error) => {
        this.toast.error('Picture uploaded failed. Try again later');
        //console.log(error);
      },
    });
  }

  activatePhoto(id: string, photoType: string) {
    this.activatePhotoApi(id, photoType).subscribe({
      next: (response) => {
        // this.toast.success("Picture set as profile picture")
        // console.log(response);
      },
      error: (error) => {
        //console.log(error);
        this.toast.error('Error in setting profile picture');
      },
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
          this.myProfileDetails[0].bio = response.data.bio;
        }
      },
      error: (err) => {
        //console.log(err);
      },
    });
  }

  //Apis

  uploadPhotoApi(files: FileList) {
    const formData = new FormData();
    formData.append('photoType', 'profile');
    formData.append('size', '256x256');
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files.item(i) as File, `file${i}`);
    }
    const baseUrl = `${this.api.url}/api/v1/users/uploadphoto`;
    return this.http.post(baseUrl, formData, { withCredentials: true });
  }
  getMyProfilePicture() {
    this.getMyActivatedPhotoApi('profile').subscribe({
      next: (response) => {
        //console.log(response);
        const mimeType = response.data.photo.mimeType;
        const photoContent = response.data.photo.photoContent;
        const imageDataUrl = `data:${mimeType};base64,${photoContent}`;
        this.myProfileDetails[0].profilePicture = imageDataUrl;
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }
  activatePhotoApi(photoid: string, photoType: string): Observable<any> {
    const baseUrl = `${this.api.url}/api/v1/users`;

    return this.http.patch<any>(
      `${baseUrl}/activatephoto/${photoid}`,
      { photoType },
      {
        withCredentials: true,
      }
    );
  }

  getMyActivatedPhotoApi(photoType: string) {
    const baseUrl = `${this.api.url}/api/v1/users`;

    return this.http.get<any>(`${baseUrl}/getmyactivatedphoto/${photoType}`, {
      withCredentials: true,
    });
  }
}
