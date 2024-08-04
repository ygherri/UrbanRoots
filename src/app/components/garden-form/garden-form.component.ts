import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { GardenService } from '../../services/garden.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-garden-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './garden-form.component.html',
  styleUrl: './garden-form.component.css'
})
export class GardenFormComponent {
  gardenForm: FormGroup;

  constructor(private fb: FormBuilder, private gardenService: GardenService) {
    this.gardenForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.gardenForm.valid) {
      const newGarden = this.gardenForm.value;
      this.gardenService.addGarden(newGarden).then(() => {
        console.log('Garden added successfully!');
        this.gardenForm.reset();
      }).catch(error => {
        console.error('Error adding garden: ', error);
      });
    }
  }
}
