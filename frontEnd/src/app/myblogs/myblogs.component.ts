import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MyblogsBlogCardComponent } from './myblogs-blog-card/myblogs-blog-card.component';
import { blog } from 'src/DataTypes';
import { MyblogsService } from './myblogs.service';
@Component({
  selector: 'app-myblogs',
  templateUrl: 'myblogs.component.html',
  styleUrls: ['myblogs.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MatToolbarModule,
    CommonModule,
    ToolbarComponent,
    MyblogsBlogCardComponent,
  ],
})
export class MyblogsComponent implements OnInit {
  myblogs!: blog[];
  isSetToolbar: any;
  searchKeyword: string = '';
  showSearchResult: boolean = false;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private myBlogsService: MyblogsService
  ) {}
  ngOnInit(): void {
    this.myBlogsService.getPosts();
    this.myblogs = this.myBlogsService.myblogs;
  }

  openBlog(title: string, id: string) {
    title = title.toLowerCase();
    title = title.replace(/ /g, '-');
    this.router.navigate([`/blogdetails/${title}`], { queryParams: { id } });
  }
  openEditor() {
    this.router.navigate(['/texteditor']);
  }
  trackByPostId(index: number, post: blog): string {
    return post.id; // Assuming 'id' is the unique identifier for posts
  }
  onDeletePost(deletePostId: string) {
    //find and delete post that from post array
    const indexToRemove = this.myblogs.findIndex(
      (post) => post.id === deletePostId
    );
    if (indexToRemove !== -1) {
      this.myblogs.splice(indexToRemove, 1);
    }
  }
  onSearch(searchTerm: any) {
    this.searchKeyword = searchTerm.target.value;
    if (this.searchKeyword === '') {
      this.showSearchResult = false;
      this.myBlogsService.getPosts();
      return;
    } else {
      this.showSearchResult = true;
      this.myBlogsService.getSearchResult(this.searchKeyword);
    }

  }
  onScroll(e: any) {
    this.myBlogsService.onIonInfiniteMyBlogs(e);
  }
}
