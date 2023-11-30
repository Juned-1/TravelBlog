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
    this.logoutButton.emit('logout');
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
}
