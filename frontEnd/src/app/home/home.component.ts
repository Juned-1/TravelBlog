import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APIService } from 'src/apiservice.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[IonicModule, SearchbarComponent, MatToolbarModule, CommonModule, ToolbarComponent],
  standalone: true
})
export class HomeComponent implements OnInit {
  slideIndex : number = 0;
  posts! : any;
  isLoggedIn = false;
  timeoutid: any = 0;
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService, private sanitizer : DomSanitizer) {
  }
  ngOnInit(): void {
    this.showSlides();
    this.api.authorise().subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        if(data.message === "Token verified"){
          this.isLoggedIn = true;
        }
      },
      (err) => {
        localStorage.removeItem('travel-blog');
        this.isLoggedIn = false;
      }
    );
  }
  ngAfterViewInit() {
    this.api.getPost()?.subscribe((response) => {
     if('result' in response){
      this.posts = response.result;
      for (let post of this.posts) {
        post.post_time = new Date(post.post_time).toDateString().toString();

        // Extract the first image URL from post.post_content
        let imageURL = this.extractFirstImageURL(post.post_content);
        if (imageURL === null) {
          imageURL = '../../assets/travelImage/no-image.jpg';
        }
        imageURL = (this.sanitizer.bypassSecurityTrustResourceUrl(imageURL) as any).changingThisBreaksApplicationSecurity;
        post.imageURL = imageURL;
      }
     }
    },
    (err) => {
      console.log(err);
    });
  }

  goToEditor(){
    this.router.navigate(['/texteditor']);
  }
  extractFirstImageURL(postContent: string): string | null {
    const regex = /<img src="(.*?)"/g;
    const match = regex.exec(postContent);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }
  
  openBlog(post_id : any){
    this.router.navigate(['/blogdetails'], { queryParams: { id : post_id} });
  }

  showSlides(): void {
    let i: number;
    let slides: HTMLCollectionOf<Element> =
      document.getElementsByClassName('mySlides');

    for (i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = 'none';
    }

    this.slideIndex++;

    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }

    (slides[this.slideIndex - 1] as HTMLElement).style.display = 'block';
    this.timeoutid = setTimeout(() => this.showSlides(), 3000); // Change image every 3 seconds
  }
  ngOnDestroy(){
    clearTimeout(this.timeoutid);
  }
}
