///import { sqliteDatabaseService } from './services/sqllite3/sqlite3.service';
import { GlobalsettingsService } from './services/globalsettings/globalsettings.service';
//import { HeroService } from './hero.service';
import { Component/*,Input,Output,EventEmitter*/ } from '@angular/core';

import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
//import { HeroesComponent } from './heroes/heroes.component';
///import { Hero } from '../heroInterface';
import { FormsModule } from '@angular/forms';
//import { HEROES } from './mock_Heroes';import { MessageService } from './message.service';
//import { MessagesComponent } from './messages/messages.component';
//import { SettingsService } from './settings.service';
import { VoiceRecogitionService } from './services/voice-recognition/voice-recogition.service';
///import { IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
    selector: 'app-root',
    standalone: true, // Or false if part of a module
    imports: [RouterOutlet, FormsModule, /*MessagesComponent,*/ RouterLink, RouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent  {


  title = 'APMS';
  constructor(public GlobalsettingsService:GlobalsettingsService,public voiceRecogition:VoiceRecogitionService)
  {


  }
  ngOnInit(): void {


  }
  async startListening() {

    this.voiceRecogition.startVoiceRecogintion();
  }
  stopListening()
  {
    this.voiceRecogition.stopListening();
  }

}
