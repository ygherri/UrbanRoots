import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Garden, GardenService } from '../../services/garden.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-garden-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './garden-form.component.html',
  styleUrl: './garden-form.component.css'
})
export class GardenFormComponent implements OnInit {
  gardenForm: FormGroup;
  error: string = '';
  userGardens$!: Observable<Garden[]>;
  showForm: boolean = false;
  showModal: boolean = false; 

  @ViewChild('addGardenForm') addGardenForm: ElementRef | undefined;

  constructor(
    private fb: FormBuilder,
    private gardenService: GardenService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.gardenForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getAuthUser().subscribe((currentUser: { uid: string }) => {
      if (currentUser) {
        this.userGardens$ = this.gardenService.getGardensByUser(currentUser.uid);
        this.userGardens$.subscribe(gardens => {
          console.log('User gardens:', gardens);
        });
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.scrollToAddGarden();
    }
  }

  scrollToAddGarden() {
    this.addGardenForm?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit() {
    if (this.gardenForm.valid) {
      const address = this.gardenForm.value.address;
      const encodedAddress = encodeURIComponent(address);
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

      this.authService.getAuthUser().subscribe((currentUser: { uid: any }) => {
        if (!currentUser) {
          this.error = 'Utilisateur non connecté.';
          return;
        }

        this.http.get<any[]>(geocodeUrl).subscribe({
          next: (results) => {
            if (results.length === 0) {
              this.error = 'Adresse introuvable. Veuillez la vérifier.';
              return;
            }

            const location = results[0];
            const newGarden = {
              ...this.gardenForm.value,
              createdBy: currentUser.uid,
              approved: false,
              location: {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon)
              }
            };

            this.gardenService.addGarden(newGarden).then(() => {
              console.log('Jardin ajouté avec succès!');
              this.gardenForm.reset();
            this.showModal = true; 
            setTimeout(() => this.showModal = false, 10000);
            });
          },
          error: () => {
            this.error = 'Erreur réseau lors du géocodage.';
          }
        });
      });
    }
  }

  deleteGarden(gardenId: string | number): void {
    const idAsString = String(gardenId);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce jardin?')) {
      this.gardenService.deleteGarden(idAsString).then(() => {
        console.log('Jardin supprimé avec succès!');
      }).catch(error => {
        console.error('Erreur lors de la suppression du jardin : ', error);
      });
    }
  }

  createEvent(gardenId: string | number): void {
    const idAsString = String(gardenId);
    const url = `/gardens/${idAsString}/events/new`;
    this.router.navigate([url]);
  }
}
