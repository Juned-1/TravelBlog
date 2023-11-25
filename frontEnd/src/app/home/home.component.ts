import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CommonModule } from '@angular/common';
import { data } from '../myblogs/dummyData';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
register();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonicModule, SearchbarComponent, MatToolbarModule, CommonModule],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  blogPosts = data;
  slideIndex: number = 0;
  constructor(private router: Router) {}

  ngOnInit() {
    this.showSlides();
  }

  openBlog(){
    this.router.navigate(['/blog']);
  }

  showSlides(): void {
    let i: number;
    let slides: HTMLCollectionOf<Element> = document.getElementsByClassName('mySlides');

    for (i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = 'none';
    }

    this.slideIndex++;

    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }

    (slides[this.slideIndex - 1] as HTMLElement).style.display = 'block';
    setTimeout(() => this.showSlides(), 3000); // Change image every 2 seconds
  }
}
