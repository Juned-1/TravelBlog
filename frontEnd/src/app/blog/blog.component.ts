import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { APIService } from 'src/apiservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule,ToolbarComponent,QuillModule]
})
export class BlogComponent  implements OnInit, OnDestroy, AfterViewInit {
  isLoggedIn = true;
  id! : number;
  post:any;
  time:String="";
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router : Router, private api : APIService, private toast : ToastrService) {
    
  }
  ngOnInit() {
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
      }
    );
    this.id = this.route.snapshot.queryParams['id'];
  }
  ngAfterViewInit(){
    //this.id = localStorage.getItem()
    this.api.getSpecificPost(this.id).subscribe((response) => {
      const data = JSON.parse(JSON.stringify(response));
      this.post = data.result[0];
      this.time = new Date(this.post.post_time).toDateString().toString();
    },(err) => {
      this.toast.error("Error loading post");
      console.log(err);
    })
  }
  ngOnDestroy(): void {
  }
}
