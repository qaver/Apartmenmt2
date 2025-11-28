
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments';
import { enableProdMode } from '@angular/core';
///import '@capacitor-community/sqlite';
///import { defineCustomElements as jeepSqliteSet } from 'jeep-sqlite/loader'; // Import the loader
///jeepSqliteSet(window);

if (environment.production)
{
   enableProdMode(); // Often commented out or removed for simplicity
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


