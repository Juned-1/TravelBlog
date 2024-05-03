import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LikeObj, sendPostBulk, SearchParameter } from './DataTypes';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private http: HttpClient) {}
  signup(formData: any) {
    return this.http.post(
      'http://localhost:8081/api/v1/users/signup',
      formData,
      { withCredentials: true }
    );
  }
  login(formData: any) {
    return this.http.post(
      'http://localhost:8081/api/v1/users/login',
      formData,
      { withCredentials: true }
    );
  }
  authorise() {
    return this.http.get('http://localhost:8081/api/v1/users/authstatus', {
      withCredentials: true,
    });
  }
  logout() {
    return this.http.get('http://localhost:8081/api/v1/users/logout', {
      withCredentials: true,
    });
  }
  post(data: sendPostBulk) {
    return this.http.post(
      'http://localhost:8081/api/v1/blogs/writepost',
      data,
      { withCredentials: true }
    );
  }
  getPost(page: number) {
    const baseurl = 'http://localhost:8081/api/v1/blogs/getpost';
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(baseurl, { params, withCredentials: true });
  }
  getMyPost(parameter: SearchParameter, page: number) {
    // return this.http.get('http://localhost:8081/api/v1/blogs/getmypost', {
    //   withCredentials: true,
    // });
    let baseurl = 'http://localhost:8081/api/v1/blogs/getmypost';
    let params = new HttpParams().set('page', parameter.page.toString());
    if (parameter.title) {
      params = params.append('title', encodeURIComponent(parameter.title));
    }
    if (parameter.subtitle) {
      params = params.append(
        'subtitle',
        encodeURIComponent(parameter.subtitle)
      );
    }
    return this.http.get(baseurl, { params, withCredentials: true });
  }
  getSpecificPost(id: string) {
    console.log(id);
    const baseurl = `http://localhost:8081/api/v1/blogs/getspecificpost/${id}`;
    return this.http.get(baseurl, { withCredentials: true });
  }
  deletePost(id: string) {
    const baseurl = `http://localhost:8081/api/v1/blogs/deletepost/${id}`;
    return this.http.delete(baseurl, { withCredentials: true });
  }
  editPost(data: sendPostBulk, id: string) {
    const baseurl = `http://localhost:8081/api/v1/blogs/editpost/${id}`;
    return this.http.patch(baseurl, data, { withCredentials: true });
  }
  likedislike(data: LikeObj) {
    const baseurl = `http://localhost:8081/api/v1/blogs/likedislike/${data.id}`;
    const reactionType = data.value;
    return this.http.patch(
      baseurl,
      { reactionType },
      { withCredentials: true }
    );
  }
  searchPost(parameter: SearchParameter) {
    const baseurl = 'http://localhost:8081/api/v1/blogs/getpost';
    let params = new HttpParams().set('page', parameter.page.toString());
    if (parameter.title) {
      params = params.append('title', encodeURIComponent(parameter.title));
    }
    if (parameter.subtitle) {
      params = params.append(
        'subtitle',
        encodeURIComponent(parameter.subtitle)
      );
    }
    return this.http.get(baseurl, { params, withCredentials: true });
  }
  getMyDetails() {
    return this.http.get('http://localhost:8081/api/v1/users/getmydetails', {
      withCredentials: true,
    });
  }
  setUserDetails(data: any) {
    return this.http.patch(
      'http://localhost:8081/api/v1/users/setuserdetails',
      data,
      { withCredentials: true }
    );
  }
  sendOTP(userid: string, token: string) {
    const baseurl = `http://localhost:8081/api/v1/users/authenticateEmail/${userid}`;
    return this.http.patch(baseurl, { token }, { withCredentials: true });
  }
  resendOTP(userid: string) {
    const baseurl = `http://localhost:8081/api/v1/users/rsendsignuptoken/${userid}`;
    return this.http.get(baseurl, { withCredentials: true });
  }
  validateEmail(email: string) {
    const baseurl = `http://localhost:8081/api/v1/users/forgotpassword`;
    return this.http.post(baseurl, { email }, { withCredentials: true });
  }
  resetPassword(
    userid: string,
    body: { password: string; passwordConfirm: string; token: string }
  ) {
    const baseurl = `http://localhost:8081/api/v1/users/resetpassword/${userid}`;
    return this.http.patch(baseurl, body, { withCredentials: true });
  }
  updatePasswordVerification(email: string) {
    const baseurl = `http://localhost:8081/api/v1/users/updatepasswordverification`;
    return this.http.post(baseurl, { email }, { withCredentials: true });
  }
  updatePassword(body: { password: string; passwordConfirm: string }) {
    const baseurl = `http://localhost:8081/api/v1/users/updatepassword`;
    return this.http.patch(baseurl, body, { withCredentials: true });
  }
  updateEmailVerification(oldEmail: string, newEmail: string) {
    const body = { oldEmail, newEmail };
    const baseurl = `http://localhost:8081/api/v1/users/updateemailverification`;
    return this.http.post(baseurl, body, { withCredentials: true });
  }
  updateEmail(token: string, email: string) {
    const body = { token, email };
    const baseurl = `http://localhost:8081/api/v1/users/updateemail`;
    return this.http.patch(baseurl, body, { withCredentials: true });
  }

  //Comments
  writeComment(postid: string, parentId: string | null, commentText: string) {
    const baseurl = `http://localhost:8081/api/v1/comments/writecomment/${postid}`;
    if (parentId === null) {
      const body = {
        commentText: commentText,
      };
      return this.http.post(baseurl, body, { withCredentials: true });
    } else {
      const body = {
        commentText: commentText,
        parentId: parentId,
      };
      return this.http.post(baseurl, body, { withCredentials: true });
    }
  }

  getComments(postid: string, page: number, parentid: string) {
    const baseurl = `http://localhost:8081/api/v1/comments/getcomments/${postid}/${parentid}`;
    let params = new HttpParams();
    params = params.set('page', page.toString());
    return this.http.get(baseurl, { params, withCredentials: true });
  }

  editComment(commentid: string, commentText: string) {
    const body = {
      commentText,
    };
    const baseurl = `http://localhost:8081/api/v1/comments/editcomment/${commentid}`;
    return this.http.patch(baseurl, body, { withCredentials: true });
  }

  deleteComment(commentid: string) {
    const baseurl = `http://localhost:8081/api/v1/comments/deletecomment/${commentid}`;
    return this.http.delete(baseurl, { withCredentials: true });
  }

  getMyFollowerList() {
    return this.http.get('http://localhost:8081/api/v1/users/myfollowerlist', {
      withCredentials: true,
    });
  }

  followUnfollow(id: string) {
    const baseurl = `http://localhost:8081/api/v1/users/follow/${id}`;
    return this.http.post(baseurl, {}, { withCredentials: true });
  }

  getprofile(id: string) {
    return this.http.get(
      `http://localhost:8081/api/v1/users/getprofile/${id}`,
      {
        withCredentials: true,
      }
    );
  }

  uploadProfilePhoto(files: FileList) {
    const formData = new FormData();
    formData.append('photoType', 'profile');
    formData.append('size', '256x256');
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files.item(i) as File, `file${i}`);
    }

    const baseUrl = 'http://localhost:8081/api/v1/users/uploadphoto';
    return this.http.post(baseUrl, formData, { withCredentials: true });
  }

  getUserDetails(userid: string) {
    return this.http.get(
      `http://localhost:8081/api/v1/users/getuserdetails/${userid}`
    );
  }

  getPostforProfile(id: string) {
    return this.http.get(`http://localhost:8081/api/v1/blogs/userpost/${id}`);
  }

  toggleProfile(lock: boolean) {
    // const baseurl = `http://localhost:8081/api/v1/blogs/editpost/${id}`;
    // return this.http.patch(baseurl, data, { withCredentials: true });
    const data = {};

    if (lock) {
      return this.http.patch(
        `http://localhost:8081/api/v1/users/unlockpofile`,
        data,
        { withCredentials: true }
      );
    } else {
      return this.http.patch(
        `http://localhost:8081/api/v1/users/lockpofile`,
        data,
        { withCredentials: true }
      );
    }
  }

  getBio(userid: string) {
    return this.http.get(`http://localhost:8081/api/v1/users/getbio/${userid}`);
  }
  getMyBio(id: string) {
    return this.http.get(`http://localhost:8081/api/v1/users/getmybio`);
  }
}
