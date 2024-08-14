import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit{
  eventForm: FormGroup;
  gardenId!: string;
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      maxParticipants: [null],
    });
  }

  ngOnInit(): void {
    this.gardenId = this.route.snapshot.paramMap.get('gardenId')!;
    this.authService.getAuthUser().subscribe((user: { uid: string; }) => {
      this.userId = user?.uid || '';
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const newEvent: Event = {
        ...this.eventForm.value,
        gardenId: this.gardenId,
        organizers: [this.userId],
        date: new Date(this.eventForm.value.date) as unknown as Timestamp,
      };
      this.eventService.addEvent(newEvent).then(() => {
        this.router.navigate(['/calendar']);
      });
    }
  }
}
