import { Injectable, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { APIService } from 'src/apiservice.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  loggedIn: boolean = false;
  user: string | null = '';

  constructor(private api: APIService) {}

  ngOnInit(): void {
    console.log('AuthService OnInit');
  }

  checkLoggedIn() {
    this.api.authorise().subscribe({
      next: (response) => {
        const res = JSON.parse(JSON.stringify(response));
        if (res.status === 'success' && res.message === 'Token verified') {
          console.log('User is loggedIn');
          this.loggedIn = true;
          this.getUser();
        } else {
          console.log('Bad response');
        }
      },
      error: (err) => {
      },
    });
  }

  getUser() {
    if (localStorage.getItem('travel-blog') !== null) {
      this.user = localStorage.getItem('travel-blog');
    } else {
      this.user = 'XYZ';
    }
    return this.user;
  }
}