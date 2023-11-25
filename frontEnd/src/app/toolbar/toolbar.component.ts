import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [IonicModule, SearchbarComponent, MatToolbarModule, CommonModule],
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router, public loginService: LoginService) {}

  ngOnInit() {}

  logout() {
    this.loginService.loggedIn = false;
    this.router.navigate(['/login']);
  }
  login() {
    this.router.navigate(['/login']);
  }
  signup() {
    this.router.navigate(['/signup']);
  }
  routeToHome() {
    this.router.navigate(['/']);
  }
  routeToMyBlogs(){
    this.router.navigate(['/myblogs']);
  } 
}