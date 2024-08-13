import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit{
  events$!: Observable<Event[]>;
  gardenId!: string;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.gardenId = this.route.snapshot.paramMap.get('gardenId')!;
    this.events$ = this.eventService.getEventsByGarden(this.gardenId);
  }
  deleteEvent(eventId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      this.eventService.deleteEvent(eventId).then(() => {
        console.log('Événement supprimé avec succès');
        this.events$ = this.eventService.getEventsByGarden(this.gardenId);
      }).catch(error => {
        console.error('Erreur lors de la suppression de l\'événement:', error);
      });
    }
  }
}
