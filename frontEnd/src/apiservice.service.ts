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

  getFollowingList(id: string) {
    return this.http.get(
      `http://localhost:8081/api/v1/users/followinglist/${id}`,
      {
        withCredentials: true,
      }
    );
  }

  getFollowerList(id: string) {
    return this.http.get(
      `http://localhost:8081/api/v1/users/followerlist/${id}`,
      {
        withCredentials: true,
      }
    );
  }

  getMyFollowingList() {
    return this.http.get('http://localhost:8081/api/v1/users/myfollowinglist', {
      withCredentials: true,
    });
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

  removeFollower(userid: string) {
    const url = `http://localhost:8081/api/v1/users/removefollower/${userid}`;
    return this.http.delete(url, { withCredentials: true });
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
      `http://localhost:8081/api/v1/users/getuserdetails/${userid}`,
      { withCredentials: true }
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

  //CHAT APIs
  createIndividualConversation(data: any): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';
    return this.http.post<any>(`${baseUrl}/individualconversation`, data, {
      withCredentials: true,
    });
  }

  deleteConversation(convid: string): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';

    return this.http.delete<any>(`${baseUrl}/deleteconversation/${convid}`, {
      withCredentials: true,
    });
  }

  sendMessage(convid: string, data: any): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';

    return this.http.post<any>(`${baseUrl}/sendmessage/${convid}`, data, {
      withCredentials: true,
    });
  }

  getAllConversation(): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';

    let page = 0;
    const params = new HttpParams().set('page', page.toString());

    return this.http.get<any>(`${baseUrl}/allconversation`, {
      params,
      withCredentials: true,
    });
  }

  getMessage(convid: string): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';

    return this.http.get<any>(`${baseUrl}/receivemessage/${convid}`, {
      withCredentials: true,
    });
  }

  deleteAttachment(attachmentId: string): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';

    return this.http.delete<any>(
      `${baseUrl}/deleteattachment/${attachmentId}`,
      {
        withCredentials: true,
      }
    );
  }

  deleteMessage(messageId: string): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';

    return this.http.delete<any>(`${baseUrl}/deletemessage/${messageId}`, {
      withCredentials: true,
    });
  }

  editMessage(messageId: string, data: any): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/chats';

    return this.http.patch<any>(`${baseUrl}/editmessage/${messageId}`, data, {
      withCredentials: true,
    });
  }

  //googlelogin
  googleLogin(token: string): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/users';

    return this.http.patch<any>(
      `${baseUrl}/googlelogin`,
      { token },
      { withCredentials: true }
    );
  }

  //social and bio
  setBio(bio: string): Observable<any> {
    const baseUrl = 'http://localhost:8081/api/v1/users';

    return this.http.patch<any>(
      `${baseUrl}/addbio`,
      { bio },
      { withCredentials: true }
    );
  }

  addSocial(socialAccountType: string, socialAccountLink: string) {
    console.log('type',socialAccountType,':::link',socialAccountLink);
    const baseUrl = 'http://localhost:8081/api/v1/users';

    return this.http.patch<any>(
      `${baseUrl}/addsocial`,
      { socialAccountType, socialAccountLink },
      { withCredentials: true }
    );
  }

  getMyBio() {
    const baseUrl = 'http://localhost:8081/api/v1/users';

    return this.http.get<any>(`${baseUrl}/getmybio`, {
      withCredentials: true,
    });
  }

  getMySocialLinks(type:string){
    const baseUrl = 'http://localhost:8081/api/v1/users';

    return this.http.get<any>(`${baseUrl}/getmysocial/${type}`, {
      withCredentials: true,
    });
  }
}
