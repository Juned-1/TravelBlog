import { AfterViewInit, Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ToolbarComponent } from 'src/app/toolbar/toolbar.component';

@Component({
  selector: 'app-myblogs-blog-card',
  templateUrl: './myblogs-blog-card.component.html',
  styleUrls: ['./myblogs-blog-card.component.scss'],
  standalone: true,
  imports: [IonicModule, MatToolbarModule, CommonModule, ToolbarComponent],
})
export class MyblogsBlogCardComponent  implements OnInit {
  @Input() post: any;
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService, private sanitizer : DomSanitizer, private toast: ToastrService) { }

  ngOnInit() {}

  deleteBlog(e: any) {
    e.stopPropagation();
    const id = e.srcElement.id;
    this.api.deletePost(id).subscribe(
      (response) => {
        const data = JSON.parse(JSON.stringify(response));
        this.toast.success('Successfully Deleted');
        // this.router.navigate(['/userblog']);
        // this.ngAfterViewInit();
      },
      (err) => {
        this.toast.error('Error deleting post');
        console.log(err);
      }
    );
  }
  editBlog(e: any){
    e.stopPropagation();
    const id = e.srcElement.id;
    this.router.navigate(['/texteditor'],{ queryParams: { id: id} });
  } 
}
