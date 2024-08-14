import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Garden, GardenService } from '../../services/garden.service';
import { addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  selectedView: string = 'calendar';
  viewDate: Date = new Date();
  daysInMonth: Date[] = [];
  monthName: string = '';
  events: (Event & { gardenName?: string })[] = [];
  currentPage: number = 1;
  eventsPerPage: number = 8;
  gardensMap: { [key: string]: string } = {}; 

  constructor(
    private eventService: EventService,
    private gardenService: GardenService
  ) {}

  ngOnInit(): void {
    this.loadGardens();
    this.generateCalendar();
    this.loadEvents();
  }

  toggleView(view: string): void {
    this.selectedView = view;
  }
  private loadGardens(): void {
    this.gardenService.getAllGardens().subscribe((gardens: Garden[]) => {
      this.gardensMap = gardens.reduce((acc: { [key: string]: string }, garden) => {
        acc[String(garden.id)] = garden.name;
        return acc;
      }, {});
    });
  }
  

  private generateCalendar(): void {
    const start = startOfWeek(startOfMonth(this.viewDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(this.viewDate), { weekStartsOn: 1 });
    this.daysInMonth = eachDayOfInterval({ start, end });
    this.monthName = format(this.viewDate, 'MMMM yyyy');
  }

  private loadEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.map(event => ({
        ...event,
        gardenName: this.getGardenName(event.gardenId)
      }));
    });
  }

  getEventsForDay(day: Date): (Event & { gardenName?: string })[] {
    return this.events.filter(event =>
      isSameDay(event.date.toDate(), day)
    );
  }

  private getGardenName(gardenId: string | number): string {
    return this.gardensMap[String(gardenId)] || 'Unknown Garden';
  }

  addMonth(months: number): void {
    this.viewDate = addMonths(this.viewDate, months);
    this.generateCalendar();
  }

  isToday(day: Date): boolean {
    return isSameDay(day, new Date());
  }

  get paginatedEvents(): (Event & { gardenName?: string })[] {
    const startIndex = (this.currentPage - 1) * this.eventsPerPage;
    return this.events.slice(startIndex, startIndex + this.eventsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  totalPages(): number {
    return Math.ceil(this.events.length / this.eventsPerPage);
  }

  deleteEvent(eventId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      this.eventService.deleteEvent(eventId).then(() => {
        this.loadEvents();
      });
    }
  }
}
