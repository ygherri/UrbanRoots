import { Component, OnInit } from '@angular/core';
import { GardenService } from '../../services/garden.service';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approve-gardens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-gardens.component.html',
  styleUrls: ['./approve-gardens.component.css']
})
export class ApproveGardensComponent implements OnInit {
  gardens$: Observable<any[]> | undefined;

  constructor(private gardenService: GardenService, private firestore: Firestore) {}

  ngOnInit() {
    const gardensCollection = collection(this.firestore, 'gardens');
    this.gardens$ = collectionData(gardensCollection, { idField: 'id' });
  }

  approveGarden(gardenId: string) {
    this.gardenService.approveGarden(gardenId).then(() => { 
      console.log(`Garden ${gardenId} approved`);
    }).catch(error => { 
      console.error('Error approving garden: ', error);
    });
  }

  rejectGarden(gardenId: string) {
    this.gardenService.rejectGarden(gardenId).then(() => { 
      console.log(`Garden ${gardenId} rejected`);
    }).catch(error => { 
      console.error('Error rejecting garden: ', error); 
    });
  }
  deleteGarden(gardenId: string) { 
    this.gardenService.rejectGarden(gardenId).then(() => {
      console.log(`Garden ${gardenId} deleted`);
    }).catch(error => {
      console.error('Error deleting garden: ', error);
    });
  }
}
