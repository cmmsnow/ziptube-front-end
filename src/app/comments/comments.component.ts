import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MockComments} from '../mock-comments';
import {CommentsService} from '../service/comments.service';
import { Comment } from '../comment';
import {AUTHENTICATED_USER} from '../service/authentication.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})


export class CommentsComponent implements OnInit {
  comments!: Comment[];
  @Input() videoID!: number;
  @Input() videoUser!: string;
  comment!: Comment;
  newComment!: string;
  username!: string;
  isUserLoggedIn!: boolean;
  canDelete!: boolean;
  editedComment!: string;
  updatedComment!: Comment;

  constructor(private commentsService: CommentsService) { }
  ngOnInit(): void {
    this.getComments();
    // @ts-ignore
    this.username = sessionStorage.getItem(AUTHENTICATED_USER);
    this.isUserLoggedIn = this.isLoggedIn();
    // this.canDelete = this.canUserDelete(comme);
  }
  isLoggedIn(): boolean {
    if (this.username == null){
      return false;
    } else {
      return true;
    }
  }
  canUserDelete(commentUsername: string): boolean {
    if (this.isLoggedIn() && this.videoUser === this.username){
      return true;
    } else if (this.isLoggedIn() && commentUsername === this.username){
      return true;
    }
    return false;
  }
  // getCommentFromId(commentID: number): Comment {
  //   return this.comments.filter(comment => (comment.commentId === commentID));
  // }
  getComments(): void {
    this.commentsService.getComments()
      .subscribe((comments: Comment[]) => this.comments = comments);
  }
  addComment(): void {
    this.commentsService.addComment(this.username, this.videoID, this.newComment).subscribe(
      response => {
        console.log(response);
      },
      error => {
        window.onbeforeunload = null;
        console.log(error);
      });
  }

  // need to ensure sending entire comment for edit comment to work
  editComments = (commentID: number) => {
    this.updatedComment.commentId = commentID;
    this.updatedComment.comment = this.editedComment;
    this.commentsService.updateComment(commentID, this.editedComment).subscribe(
      response => {
        console.log(this.editedComment);
        console.log(response);
        return response;
      }
    );
  }

  deleteComment = (commentID: number) => {
    this.commentsService.deleteComment(commentID).subscribe(
      response => {
        return response;
      });
  }
}


