import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http : HttpClient) { }
  signup(formData : any){
    return this.http.post("http://localhost:8081/signup",formData,{withCredentials : true});
  }
  login(formData : any){
    return this.http.post("http://localhost:8081/login",formData,{withCredentials : true});
  }
  authorise(){
    return this.http.get("http://localhost:8081/auth-status",{withCredentials : true});
  }
  logout(){
    return this.http.get("http://localhost:8081/logout",{withCredentials : true});
  }
  post(data : any){
    return this.http.post('http://localhost:8081/writePost',data,{withCredentials : true});
  }
  getPost(){
    return this.http.get("http://localhost:8081/getPost",{withCredentials : true});
  }
  userPost(){
    return this.http.get("http://localhost:8081/userPost",{withCredentials : true});
  }
  getSpecificPost(search : number){
    return this.http.get("http://localhost:8081/getSpecificPost?search="+search,{withCredentials : true});
  }
  deletePost(search : number){
    return this.http.get("http://localhost:8081/deletePost?search="+search,{withCredentials : true});
  }
}