import { Injectable, OnInit } from '@angular/core';
import { APIService } from 'src/apiservice.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  loggedIn: boolean = false;
  user: string | null = '';
  currentUserId: string = '';

  constructor(private api: APIService) {}

  ngOnInit(): void {
    console.log('AuthService OnInit');
  }

  checkLoggedIn() {
    this.api.authorise().subscribe({
      next: (response) => {
        const res = JSON.parse(JSON.stringify(response));
        if (res.status === 'success' && res.message === 'Token verified') {
          this.loggedIn = true;
          this.getUser();
          this.getUserId();
        } else {
          console.log('Bad response');
        }
      },
      error: (err) => {},
    });
  }

  getUser() {
    const user = localStorage.getItem('travel-blog');
    this.user = user === null ? 'XYZ' : user;
    return this.user;
  }

  getUserId() {
    const id = localStorage.getItem('currentUserId');
    this.currentUserId = id === null ? '' : id;
    return this.currentUserId;
  }
}
