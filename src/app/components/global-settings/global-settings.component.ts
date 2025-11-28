import { VoiceRecogitionService } from './../../services/voice-recognition/voice-recogition.service';
import { GlobalsettingsService } from '../../services/globalsettings/globalsettings.service';
///import { globalSettings } from '../..//commondfiles/settings';

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { /*ActivatedRoute, Router, */ RouterModule } from '@angular/router';
import { MessageService } from '../../services/message/message.service';

@Component({
    selector: 'app-global-settings',
    imports: [RouterModule,FormsModule],
    templateUrl: './global-settings.component.html',
    styleUrl: './global-settings.component.css'
})
export class GlobalSettingsComponent {
constructor(public globalsettingsService:GlobalsettingsService,private voiceService:VoiceRecogitionService,private messageService:MessageService) {

}
ngOnInit(): void
{
      this.messageService.clear();
}
onClickUseLocalDatabase(event:any)
{
  this.globalsettingsService.setUseLocalDatabase(event.currentTarget.checked);
  /*if (event.currentTarget.checked)
  {
    this.globalsettingsService.setUseVoiceCommand(false);
  }
  console.log(event.currentTarget.checked);*/
}
onClickUseVoiceCommand(event:any)
{
    this.globalsettingsService.setUseVoiceCommand(event.currentTarget.checked);
    if (event.currentTarget.checked)
    {
        console.log(" voice off");
        this.voiceService.stopListening();
    }
    else
    {
        console.log(" voice on");
        this.voiceService.startVoiceRecogintion();
    }
}
  //console.log(event.currentTarget.checked);
onClickUseUseFetchCommand(event:any)
{
  this.globalsettingsService.setUseFetchCommand(event.currentTarget.checked);
  //console.log(event.currentTarget.checked);
}
onSelectDatabaseName(event:any)
{
  this.globalsettingsService.setDatabaseName(event.currentTarget.value);
}
}
