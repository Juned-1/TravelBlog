import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-myblogs',
  templateUrl: 'myblogs.component.html',
  styleUrls: ['myblogs.component.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule, ToolbarComponent],
})
export class MyblogsComponent implements OnInit, AfterViewInit {
  isLoggedIn = true;;
  posts! : any;
  isSetToolbar: any;
  constructor(private route: ActivatedRoute, private router: Router, private api : APIService, private sanitizer : DomSanitizer) {

  }
  ngOnInit(): void {
    this.api.authorise().subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        if (data.message === 'Token verified') {
          this.isLoggedIn = true;
        }
      },
      (err) => {
        localStorage.removeItem('travel-blog');
        this.isLoggedIn = false;
        this.router.navigate(["/"]);
      }
    );
  }
  ngAfterViewInit() {
    this.api.userPost().subscribe((response) => {
      if('result' in response){
       this.posts = response.result;
       for (let post of this.posts) {
         let imageURL = this.extractFirstImageURL(post.post_content);
         if (imageURL === null) {
           imageURL = '../../assets/travelImage/no-image.jpg';
         }
         imageURL = (this.sanitizer.bypassSecurityTrustResourceUrl(imageURL) as any).changingThisBreaksApplicationSecurity;
         post.imageURL = imageURL;
       }
       console.log(this.posts);
      }
     },
     (err) => {
       console.log(err);
     });
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
  openBlog(post_id : number){
    this.router.navigate(['/blog-details'], { queryParams: { id : post_id} });
  }
  openEditor(){
    this.router.navigate(['/texteditor']);
  }
}