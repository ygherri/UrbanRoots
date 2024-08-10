import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { GardenService } from '../../services/garden.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { user } from '@angular/fire/auth';



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


  constructor(private fb: FormBuilder, private gardenService: GardenService, private authService: AuthService) {
    this.gardenForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.gardenForm.valid) {
      this.authService.getAuthUser().subscribe(async (currentUser: { uid: any; }) => {
        if (currentUser) {
          const newGarden = {
            ...this.gardenForm.value,
            createdBy: currentUser.uid
          };

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: newGarden.address }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const location = results[0].geometry.location;
                newGarden['latitude'] = location.lat();
                newGarden['longitude'] = location.lng();
                this.gardenService.addGarden(newGarden).then(() => {
                  console.log('Garden added successfully!');
                  this.gardenForm.reset();
                }).catch(error => {
                  console.error('Error adding garden: ', error);
                });
              } else {
                this.error = 'Unable to get location from address';
              }
            });
          
        } else {
          console.error('Utilisateur non authentifié');
        }
      });
    }
    }
  }
    
    
