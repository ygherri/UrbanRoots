import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Garden, GardenService } from '../../services/garden.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-garden-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './garden-form.component.html',
  styleUrl: './garden-form.component.css'
})
export class GardenFormComponent {
  gardenForm: FormGroup;
  error: string = '';
  userGardens$!: Observable<Garden[]>;


  constructor(private fb: FormBuilder, private gardenService: GardenService, private authService: AuthService, private router: Router) {
    this.gardenForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.authService.getAuthUser().subscribe((currentUser: { uid: string; }) => {
      if (currentUser) {
        this.userGardens$ = this.gardenService.getGardensByUser(currentUser.uid);
        this.userGardens$.subscribe(gardens => {
          console.log('User gardens:', gardens);
        });
      }
    });
  }

  onSubmit() {
    if (this.gardenForm.valid) {
      this.authService.getAuthUser().subscribe(async (currentUser: { uid: any; }) => {
        if (currentUser) {
          const newGarden = {
            ...this.gardenForm.value,
            createdBy: currentUser.uid,
            approved: false
          };
  
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: newGarden.address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const location = results[0].geometry.location;
              newGarden['location'] = {
                latitude: location.lat(),
                longitude: location.lng()
              };
  
              this.gardenService.addGarden(newGarden).then(() => {
                console.log('Jardin ajouté avec succès!');
                this.gardenForm.reset();
              }).catch(error => {
                console.error('Erreur lors de l\'ajout du jardin : ', error);
              });
            } else {
              this.error = 'Impossible d\'obtenir la localisation à partir de l\'adresse';
            }
          });
        } else {
          console.error('Utilisateur non authentifié');
        }
      });
    }
  }
  deleteGarden(gardenId: string | undefined): void {
    if (!gardenId) {
      console.error('Invalid garden ID');
      return;
    }
  
    if (confirm('Êtes-vous sûr de vouloir supprimer ce jardin?')) {
      this.gardenService.deleteGarden(gardenId).then(() => {
        console.log('Jardin supprimé avec succès!');
      }).catch(error => {
        console.error('Erreur lors de la suppression du jardin : ', error);
      });
    }
  }
  createEvent(gardenId: string): void {
    const url = `/gardens/${gardenId}/events/new`;
    console.log('Navigating to:', url);
    this.router.navigate([url]);
  }
  
    
}
