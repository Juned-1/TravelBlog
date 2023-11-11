import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { data } from './dummyData';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule, ToolbarComponent],
})
export class HomePage implements OnInit, AfterViewInit {
  blogPosts = data;
  isSetToolbar: any;
  constructor(private route: ActivatedRoute, private router: Router, public loginService: LoginService) {
    if (!this.loginService.loggedIn) {
      this.router.navigate(['/login']);
      console.log('Constructor logged out');
    }
  }
  ngOnInit(): void {
    if (this.router.url !== '/texteditor') {
      this.isSetToolbar = true;
    } else {
      this.isSetToolbar = false;
    }
    console.log('ngOnInit');
  }
  ngAfterViewInit() {}
  LogIn() {
    if (this.loginService.loggedIn) {
      this.router.navigate(['/texteditor']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}