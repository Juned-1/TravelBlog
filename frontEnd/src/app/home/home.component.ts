import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { data } from '../myblogs/dummyData';
import { APIService } from 'src/apiservice.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[IonicModule, SearchbarComponent, MatToolbarModule, CommonModule, ToolbarComponent],
  standalone: true
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  blogPosts = data;
  signedIn = true;//If the user is signed in then show create post button otherwise signIn button
  isSetToolbar : any;
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService) {

  }
  ngOnInit(): void {
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
    let search : string = "";
    this.api.getPost(search)?.subscribe((response) => {
      console.log(response);
    },
    (err) => {
      console.log(err);
    });
  }

  goToEditor(){
    this.router.navigate(['/texteditor']);
  }
  logoutHandle(value : any){
    if(value === 'logout'){
      this.api.logout().subscribe(
      (response) => {
        localStorage.removeItem('travel-blog');
        this.isLoggedIn = false;
        console.log(response);
      },
      (err) => {
        console.log(err.error.message);
      }
    );
    }
  }
  openBlog(){}
}