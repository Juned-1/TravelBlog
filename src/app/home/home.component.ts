import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CommonModule } from '@angular/common';
import { data } from '../myblogs/dummyData';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[IonicModule, SearchbarComponent, MatToolbarModule, CommonModule],
  standalone: true
})
export class HomeComponent implements OnInit {
  blogPosts = data;
  constructor() {}
  
  ngOnInit() {}

  openBlog(){}
}
