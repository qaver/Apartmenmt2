///import { ManageAccountsService } from '../../services/ManageAccountsService/manageaccounts.service';
import { Component } from '@angular/core';
import { MessageService } from '../..//services/message/message.service';
///import { SettingsService } from '../../services/settings/settings.service';
@Component({
    selector: 'app-messages',
    imports: [],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css'
})
export class MessagesComponent
{
  constructor(public messageService: MessageService)
  {

  }
 /* constructor(public messageService: MessageService)
  {

  }*/
}
