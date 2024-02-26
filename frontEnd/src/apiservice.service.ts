import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LikeObj, sendPostBulk, SearchParameter } from './DataTypes';
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
  userPost(page: number) {
    const baseurl = 'http://localhost:8081/api/v1/blogs/userpost';
    const params = new HttpParams().set('page', page.toString());
    return this.http.get('http://localhost:8081/api/v1/blogs/userpost', {
      withCredentials: true,
    });
  }
  getSpecificPost(id: string) {
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
  searchUserPost(parameter: SearchParameter) {
    const baseurl = 'http://localhost:8081/api/v1/blogs/userpost';
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
  getUserDetails() {
    return this.http.get('http://localhost:8081/api/v1/users/getuserdetails', {
      withCredentials: true,
    });
  }
  setUserDetails(data: any) {
    return this.http.patch(
      'http://localhost:8081/api/v1/users/setuserdetails',data,
      { withCredentials: true }
    );
  }
  sendOTP(userid:string, token:string){
    const baseurl = `http://localhost:8081/api/v1/users/authenticateEmail/${userid}`
    return this.http.patch(baseurl, {token}, { withCredentials: true });
  }
  resendOTP(userid:string){
    const baseurl = `http://localhost:8081/api/v1/users/rsendsignuptoken/${userid}`
    return this.http.get(baseurl, { withCredentials: true });
  }
}
