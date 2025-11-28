//import { environment } from './../environments';
import { ApplicationConfig, importProvidersFrom/*,APP_INITIALIZER, enableProdMode */ } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ManageAccountsService } from './services/ManageAccountsService/manageaccounts.service';
import { /*HttpClientModule,*/HttpClient } from '@angular/common/http';
import { InMemoryDataService } from './services/inmemorydataservice/in-memory-data.service';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
//import { sqliteDatabaseService } from './services/sqllite3/sqlite3.service';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

import { Capacitor } from '@capacitor/core';
///import { SQLiteService } from './services/sqlite/sqlite.service';
///import { InitializeAppService } from './services/intializeappservice/initialize.app.service';
//import { defineCustomElements as pwaElements} from '@ionic/pwa-elements/loader';
///import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';



/*export function initializeDatabase(databaseService: sqliteDatabaseService)
{
  console.log("initializeDatabase called");y
  return () => databaseService.initializePlugin();
}*/
/*if (environment.production) {
  enableProdMode();
}
// --> Below only required if you want to use a web platform
const platform = Capacitor.getPlatform();
if(platform === "web")
  {
  // Web platform
  // required for toast component in Browser
  //pwaElements(window);

  // required for jeep-sqlite Stencil component
  // to use a SQLite database in Browser
  jeepSqlite(window);

  window.addEventListener('DOMContentLoaded', async () => {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      jeepEl.autoSave = true;
  });
}
// Above only required if you want to use a web platform <--

export function initializeFactory(init: InitializeAppService)
{
  return () => init.initializeApp();
}*/

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideIonicAngular({
      // Optional: Add global configuration here, e.g.,
      // mode: 'md' // force Material Design style
    }),
     EmailComposer ,
    ///InitializeAppService,
    ///SQLiteService,
     /*sqliteDatabaseService, // Provide your database service
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true, // Allows multiple APP_INITIALIZER functions to be registered
    },*/
     provideClientHydration(),provideHttpClient(), providePrimeNG({
            theme: {
                preset: Aura
            }}),
  importProvidersFrom([
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })])
  ,ManageAccountsService,HttpClient,AppRoutingModule,BrowserModule, provideIonicAngular({})]
};


/*import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
*/
