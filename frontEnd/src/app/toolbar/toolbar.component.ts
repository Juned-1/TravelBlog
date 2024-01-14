import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APIService } from 'src/apiservice.service';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [IonicModule, SearchbarComponent, MatToolbarModule, CommonModule],
})
export class ToolbarComponent implements OnInit {
  @Input() isLoggedIn! : Boolean;
  @Output() logoutButton : EventEmitter<string> = new EventEmitter<string>();
  user  : string | null = '';
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService) { }

  ngOnInit() {
    if(localStorage.getItem('travel-blog') !== null){
      this.user = localStorage.getItem('travel-blog');
    }
  }
  LogIn(){
    this.router.navigate(['/login']);
  }
  Logout(){
    this.api.logout().subscribe(
      (response) => {
        localStorage.removeItem('travel-blog');
        this.isLoggedIn = false;
      },
      (err) => {
        console.log(err.error.message);
      }
    );
    this.router.navigate(["/"]);
  }
  signup() {
    this.router.navigate(['/signup']);
  }
  routeToHome() {
    this.router.navigate(['/']);
  }
  routeToMyBlogs(){
    this.router.navigate(['/userblog']);
  }
  handleChange(e: any ) {
    console.log('ionChange fired with value: ' + e.detail.value);
    if(e.detail.value == 'logout')  this.Logout();
    if(e.detail.value == 'login')  this.LogIn();
    if(e.detail.value == 'signup')  this.signup();
    if(e.detail.value == 'myblogs')  this.routeToMyBlogs();
  }
  routeToProfile(){
    this.router.navigate(['/profile']);
  }
}

