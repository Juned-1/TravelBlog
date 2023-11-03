import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { data } from './dummyData';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, SearchbarComponent, MatToolbarModule, CommonModule],
})
export class HomePage {
  blogPosts = data;
  signedIn = true;//If the user is signed in then show create post button otherwise signIn button

  constructor() {
    // console.log(this.blogPosts);
  }
}
