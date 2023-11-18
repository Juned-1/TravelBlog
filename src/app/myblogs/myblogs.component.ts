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
  selector: 'app-myblogs',
  templateUrl: 'myblogs.component.html',
  styleUrls: ['myblogs.component.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule, ToolbarComponent],
})
export class MyblogsComponent implements OnInit, AfterViewInit {
  blogPosts = data;
  isSetToolbar: any;
  constructor(private route: ActivatedRoute, private router: Router, public loginService: LoginService) {
    // if (!this.loginService.loggedIn) {
    //   this.router.navigate(['/login']);
    //   console.log('Constructor logged out');
    // }
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
 
  openBlog(){
    this.router.navigate(['/blog']);
  }
  openEditor(){
    this.router.navigate(['/texteditor']);
  }
}