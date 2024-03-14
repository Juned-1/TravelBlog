import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from './components/comment/comment.component';
import { CommentFormComponent } from './components/commentForm/commentForm.component';
import { CommentsComponent } from './components/comments/comments.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule,IonicModule],
  declarations: [CommentsComponent, CommentComponent, CommentFormComponent],
  providers: [],
  exports: [CommentsComponent],
})
export class CommentsModule {}
