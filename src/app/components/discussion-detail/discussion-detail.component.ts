import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { Discussion } from '../../models/discussion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import firebase from 'firebase/compat/app';

interface Comment {
userId: any;
firstName: any;
  id?: string;
  text: string;
  userName: string;
  createdAt: Date;
}

interface UserData {
  firstName: string;
  lastName: string;
}

@Component({
  standalone: true,
  selector: 'app-discussion-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './discussion-detail.component.html',
  styleUrls: ['./discussion-detail.component.css']
})
export class DiscussionDetailComponent implements OnInit {
  discussion$!: Observable<Discussion | undefined>;
  comments$!: Observable<Comment[]>;
  newComment: string = '';
  discussionId: string | null = null;
  currentUserFullName: string = 'Anonymous';
currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth 
  ) {}

  ngOnInit(): void {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.currentUserFullName = `${user.displayName || user.email || 'Anonymous'}`;
        this.currentUserId = user.uid;

        this.discussionId = this.route.snapshot.paramMap.get('id');
        if (this.discussionId) {
          this.discussion$ = this.firestore.doc<Discussion>(`discussions/${this.discussionId}`).valueChanges().pipe(
            map(discussion => {
              if (discussion && discussion.createdAt instanceof firebase.firestore.Timestamp) {
                return {
                  ...discussion,
                  createdAt: discussion.createdAt.toDate()
                };
              }
              return discussion;
            })
          );

          this.comments$ = this.firestore.collection<Comment>(`discussions/${this.discussionId}/comments`, ref => ref.orderBy('createdAt', 'asc'))
            .snapshotChanges().pipe(
              map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Comment;
                const id = a.payload.doc.id;
                if (data.createdAt instanceof firebase.firestore.Timestamp) {
                  data.createdAt = data.createdAt.toDate();
                }
                return { id, ...data };
              }))
            );
        }
      } else {
      }
    });
  }

  submitComment(): void {
    if (this.newComment.trim() && this.discussionId) {
      this.auth.currentUser.then(user => {
        if (user) {
          const comment = {
            text: this.newComment,
            userName: this.currentUserFullName,
            createdAt: new Date(),
            userId: user.uid
          };
  
          this.firestore.collection(`discussions/${this.discussionId}/comments`).add(comment)
            .then(() => {
              this.newComment = '';
            })
            .catch(error => {
              console.error("Error adding comment: ", error);
            });
        } else {
          console.error("User is not authenticated.");
        }
      }).catch(error => {
        console.error("Error fetching user: ", error);
      });
    }
  }
  

  deleteComment(commentId: string): void {
    if (this.discussionId && commentId) {
      this.firestore.doc(`discussions/${this.discussionId}/comments/${commentId}`).delete()
        .then(() => {
          console.log('Comment successfully deleted!');
        })
        .catch(error => {
          console.error("Error deleting comment: ", error);
        });
    }
  }
}
