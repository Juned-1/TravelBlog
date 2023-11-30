import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { data } from './dummyData';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/apiservice.service';

@Component({
  selector: 'app-myblogs',
  templateUrl: 'myblogs.component.html',
  styleUrls: ['myblogs.component.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule, ToolbarComponent],
})
export class MyblogsComponent implements OnInit, AfterViewInit {
  @Input() isLoggedIn! : Boolean;
  blogPosts = data;
  isSetToolbar: any;
  constructor(private route: ActivatedRoute, private router: Router, private api : APIService) {

  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.api.userPost().subscribe((response) => {
      console.log(response);
    },(err) => {
      console.log(err);
    })
  }
 
  openBlog(){
    this.router.navigate(['/blog']);
  }
  openEditor(){
    this.router.navigate(['/texteditor']);
  }
}