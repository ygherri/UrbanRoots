import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp  } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CommonModule } from '@angular/common';
import { DiscussionListComponent } from './components/discussion-list/discussion-list.component';
import { DiscussionCreateComponent } from './components/discussion-create/discussion-create.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

//import { AgmCoreModule } from '@agm/core';
import { routes } from './app.routes';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { LOCALE_ID } from '@angular/core';
registerLocaleData(localeFr, 'fr');

export const appConfig: ApplicationConfig = {

  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),
    provideFunctions(() => getFunctions()),
    importProvidersFrom(
      CommonModule,
      FormsModule,
      AngularFireAuthModule,
      AngularFirestoreModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
    ), 
    provideFirebaseApp(() => initializeApp({"projectId":"urbanroots-efdce","appId":"1:490463529477:web:fc8e777cd4f5a142642a6c","storageBucket":"urbanroots-efdce.appspot.com","apiKey":"AIzaSyBKywTe7-B3pEIEoz4fP6JWp0qBj1vTvjQ","authDomain":"urbanroots-efdce.firebaseapp.com","messagingSenderId":"490463529477","measurementId":"G-RN720JBJYT"})), provideFirestore(() => getFirestore())
  ]
};
