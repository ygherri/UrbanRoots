import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

import { MapComponent } from './components/map/map.component';

//import { AgmCoreModule } from '@agm/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {

  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),
    provideFunctions(() => getFunctions()),
    importProvidersFrom(
      CommonModule,
      FormsModule,
      GoogleMapsModule
    ), provideFirebaseApp(() => initializeApp({"projectId":"urbanroots-efdce","appId":"1:490463529477:web:fc8e777cd4f5a142642a6c","storageBucket":"urbanroots-efdce.appspot.com","apiKey":"AIzaSyBKywTe7-B3pEIEoz4fP6JWp0qBj1vTvjQ","authDomain":"urbanroots-efdce.firebaseapp.com","messagingSenderId":"490463529477","measurementId":"G-RN720JBJYT"})), provideFirestore(() => getFirestore())
  ]
};
