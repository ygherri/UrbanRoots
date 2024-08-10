import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiscussionService } from '../../services/discussion.service';
import { Discussion } from '../../models/discussion';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Comment {
  text: string;
  userName: string;
  createdAt: Date;
}

@Component({
  standalone: true,
  selector: 'app-discussion-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './discussion-list.component.html',
  styleUrls: ['./discussion-list.component.css']
})
export class DiscussionListComponent implements OnInit {
  discussions$!: Observable<Discussion[]>;
  comments$!: Observable<Comment[]>;
  selectedDiscussion: Discussion | null = null;
  newComment: string = '';
  currentUser: firebase.User | null = null;

  constructor(
    private discussionService: DiscussionService,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.discussions$ = this.discussionService.getDiscussions().pipe(
      map(discussions =>
        discussions.map(discussion => ({
          ...discussion,
          createdAt: discussion.createdAt instanceof firebase.firestore.Timestamp 
            ? discussion.createdAt.toDate() 
            : discussion.createdAt
        }))
      )
    );

    this.auth.authState.subscribe(user => {
      this.currentUser = user;
    });
  }

  deleteDiscussion(id: string | undefined): void {
    if (id) {
      this.discussionService.deleteDiscussion(id);
    }
  }

  accessDiscussion(id: string): void {
    this.router.navigate(['/discussions', id]);
  }

  loadComments(discussionId: string): void {
    this.comments$ = this.firestore.collection<Comment>(`discussions/${discussionId}/comments`, ref => ref.orderBy('createdAt')).valueChanges();
  }

  submitComment(discussionId: string): void {
    if (this.newComment.trim() && this.currentUser) {
      const comment: Comment = {
        text: this.newComment,
        userName: this.currentUser.displayName || this.currentUser.email || 'Anonymous',
        createdAt: new Date()
      };

      this.firestore.collection(`discussions/${discussionId}/comments`).add(comment);
      this.newComment = '';
    }
  }
}
