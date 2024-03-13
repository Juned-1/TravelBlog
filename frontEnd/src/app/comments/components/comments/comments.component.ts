import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { ActiveCommentInterface } from '../../types/activeComment.interface';
import { CommentInterface } from '../../types/comment.interface';
import { APIService } from 'src/apiservice.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() currentUserId!: string;
  @Input() currentPostId!: string;

  comments: CommentInterface[] = [];
  activeComment: ActiveCommentInterface | null = null;
  page: number = 1;

  constructor(
    private api: APIService
  ) {}

  ngOnInit(): void {
    const postid: string = '456b18c1-7638-4ba2-a9c6-70e9ee6bc2cd';
    this.api.getComments(postid, this.page, '').subscribe({
      next: (response) => {
        console.log(response);
        const comentArr = (
          response as { status: string; resultLength: number; data: any }
        ).data.comments;
        comentArr.forEach((item) => {
          const comment: CommentInterface = this.mapResponseToInterface(item);
          this.comments.push(comment);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getRootComments(): CommentInterface[] {
    return this.comments.filter((comment) => comment.parentId === null);
  }

  updateComment({
    text,
    commentId,
  }: {
    text: string;
    commentId: string;
  }): void {

    this.api.editComment(commentId, text).subscribe({
      next: (response) => {
        const updatedComment = (
          response as { status: string; resultLength: number; data: any }
        ).data.comment;

        const newComment: CommentInterface =
          this.mapResponseToInterface(updatedComment);

        this.comments = this.comments.map((comment) => {
          if (comment.id === commentId) {
            return newComment;
          }
          return comment;
        });

        this.activeComment = null;
      },
      error: (error) => {
        console.log(error);

        this.activeComment = null;
      },
    });
  }

  deleteComment(commentId: string): void {

    this.api.deleteComment(commentId).subscribe({
      next: (response) => {
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setActiveComment(activeComment: ActiveCommentInterface | null): void {
    this.activeComment = activeComment;
  }

  addComment({
    text,
    parentId,
  }: {
    text: string;
    parentId: string | null;
  }): void {
    const postid: string = '456b18c1-7638-4ba2-a9c6-70e9ee6bc2cd';
    this.api.writeComment(postid, parentId, text).subscribe({
      next: (response) => {
        const item = (
          response as { status: string; resultLength: number; data: any }
        ).data.comment;
        console.log(item);
        const comment: CommentInterface = this.mapResponseToInterface(item);
        this.comments = [comment, ...this.comments];
        this.activeComment = null;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getReplies(commentId: string): CommentInterface[] {
    return this.comments
      .filter((comment) => comment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }

  onIonInfinite(ev: any) {
    const postid: string = '456b18c1-7638-4ba2-a9c6-70e9ee6bc2cd';

    this.page++;
    this.api.getComments(postid, this.page, '').subscribe({
      next: (response) => {
        const comentArr = (
          response as { status: string; resultLength: number; data: any }
        ).data.comments;
        if (comentArr.length === 0) this.page = this.page - 1;
        comentArr.forEach((item) => {
          const comment: CommentInterface = this.mapResponseToInterface(item);
          this.comments.push(comment);
        });
        this.comments = this.comments;
      },
      error: (error) => {
        console.log(error);
      },
    });

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 300);
  }
  fetchReply({
    replyPage,
    commentId,
  }: {
    replyPage: number;
    commentId: string;
  }) {
    console.log(commentId);
    this.api.getComments(this.currentPostId, replyPage, commentId).subscribe({
      next: (response) => {
        console.log(response);
        const comentArr = (
          response as { status: string; resultLength: number; data: any }
        ).data.comments;

        comentArr.forEach((item) => {
          const comment: CommentInterface = this.mapResponseToInterface(item);
          this.comments.push(comment);
        });
        this.comments = this.comments;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  mapResponseToInterface(commentFromResponse): CommentInterface {
    const comment: CommentInterface = {
      id: commentFromResponse.commentId,
      body: commentFromResponse.commentText,
      username:
        commentFromResponse.User.firstName +" "+ commentFromResponse.User.lastName,
      userId: commentFromResponse.userId,
      parentId:
        commentFromResponse?.parentId === undefined
          ? null
          : commentFromResponse.parentId,
      createdAt: commentFromResponse.createdAt,
      haveReplies: commentFromResponse.haveReplies,
    };

    return comment;
  }
}
