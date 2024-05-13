import {
  AfterViewInit,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
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
export class MyblogsBlogCardComponent implements OnInit {
  @Input() post: any;
  @Output() deleteEvent = new EventEmitter<string>();
  idToDelete:string='';

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
        this.idToDelete = '';
      },
    },
    {
      text: 'YES',
      role: 'confirm',
      handler: () => {
        this.api.deletePost(this.idToDelete).subscribe({
          next: (response) => {
            this.toast.success('Successfully Deleted');
            this.deleteEvent.emit(this.idToDelete);
          },
          error: (err) => {
            this.toast.error('Error deleting post');
            console.log(err);
          },
        });
      },
    },
  ];

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }


  constructor(
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService
  ) {}

  ngOnInit() {}

  deleteBlog(e: any) {
    e.stopPropagation();
    this.idToDelete = e.srcElement.id;
    
  }
  editBlog(e: any) {
    e.stopPropagation();
    const id = e.srcElement.id;
    this.router.navigate(['/texteditor'], { queryParams: { id } });
  }
}
