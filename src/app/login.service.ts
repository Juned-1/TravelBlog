import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn: boolean = false;
  credentials: any ={
    fullname: '',
    email: '',
    password: '',
    dob:'',
    gender:''
  }

  constructor() { }
}
