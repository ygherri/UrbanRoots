import { Component, OnInit } from '@angular/core';
import { GardenService } from '../../services/garden.service';
import { Firestore, collectionData, collection, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
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

  approveGarden(gardenId: string): void {
    this.gardenService.approveGarden(gardenId).then(() => {
      console.log(`Garden ${gardenId} approved`);
      this.refreshGardens(); // Appeler la méthode pour rafraîchir les jardins sur la carte
    }).catch(error => { 
      console.error('Error approving garden: ', error);
    });
  }
  rejectGarden(gardenId: string): void {
    const gardenDoc = doc(this.firestore, `gardens/${gardenId}`);
    updateDoc(gardenDoc, { approved: false }).then(() => {
      console.log(`Garden ${gardenId} rejected`);
      this.refreshGardens(); // Rafraîchir la liste des jardins après le rejet
    }).catch(error => { 
      console.error('Error rejecting garden: ', error);
    });
  }
  
  refreshGardens(): void {
    const gardensCollection = collection(this.firestore, 'gardens');
    this.gardens$ = collectionData(gardensCollection, { idField: 'id' });
  }

  async deleteGarden(gardenId: string): Promise<void> {
    const gardenDoc = doc(this.firestore, `gardens/${gardenId}`);
    return deleteDoc(gardenDoc).then(() => {
      console.log(`Garden ${gardenId} deleted`);
    }).catch(error => {
      console.error('Error deleting garden: ', error);
    });
  }
}

