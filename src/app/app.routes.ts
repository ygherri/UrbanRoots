import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './components/map/map.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GardenFormComponent } from './components/garden-form/garden-form.component';
import { ApproveGardensComponent } from './components/approve-gardens/approve-gardens.component';
import { DiscussionListComponent } from './components/discussion-list/discussion-list.component';
import { DiscussionCreateComponent } from './components/discussion-create/discussion-create.component';
import { DiscussionDetailComponent } from './components/discussion-detail/discussion-detail.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CommonModule } from '@angular/common';




export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'create-garden', component: GardenFormComponent },
  { path: 'approve-gardens', component: ApproveGardensComponent },
  { path: 'discussions', component: DiscussionListComponent },
  { path: 'discussions/create', component: DiscussionCreateComponent },
  { path: 'discussions/:id', component: DiscussionDetailComponent },
  { path: 'gardens/:gardenId/events/new', component: EventFormComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule, CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
