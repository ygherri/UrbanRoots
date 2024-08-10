import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DiscussionService } from '../../services/discussion.service';
import { Discussion } from '../../models/discussion';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  standalone: true,
  selector: 'app-discussion-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './discussion-create.component.html',
  styleUrls: ['./discussion-create.component.css']
})
export class DiscussionCreateComponent {
  discussion: Discussion = {
    title: '',
    content: '',
    userId: '',
    userName: '',
    createdAt: new Date()
  };

  constructor(private discussionService: DiscussionService, private router: Router, private auth: AngularFireAuth, private firestore: AngularFirestore) {}

  createDiscussion(): void {
    this.auth.currentUser.then(user => {
      if (user) {
        this.firestore.doc(`users/${user.uid}`).valueChanges().subscribe((userData) => {
          if (userData) {
            const fullName = `${(userData as { firstName: string; lastName: string }).firstName} ${(userData as { firstName: string; lastName: string }).lastName}`;
            this.discussion.userId = user.uid;
            this.discussion.userName = fullName;
            this.discussion.createdAt = new Date();
            this.discussionService.createDiscussion(this.discussion).then(() => {
              this.router.navigate(['/discussions']);
            });
          }
        });
      }
    });
  }
}
