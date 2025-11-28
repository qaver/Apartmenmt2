import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Account } from '../../commondfiles/commondef';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 12,Code:"", name: 'Dr. Nice' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 13,Code:"", name: 'Bombasto' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 14,Code:"", name: 'Celeritas' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 15,Code:"", name: 'Magneta',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 16,Code:"", name: 'RubberMan',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 17,Code:"", name: 'Dynama',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 18,Code:"", name: 'Dr. IQ' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 19,Code:"", name: 'Magma' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 20,Code:"", name: 'Tornado' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""}
    ]
    const heroes2 = [
      { id: 12,Code:"", name: 'Dr. Nice222',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 13,Code:"", name: 'Bombasto2' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 14,Code:"", name: 'Celeritas2',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 15,Code:"", name: 'Magneta2' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 16,Code:"", name: 'RubberMan2',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 17,Code:"", name: 'Dynama2',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 18,Code:"", name: 'Dr. IQ2',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:"" },
      { id: 19,Code:"", name: 'Magma2' ,Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""},
      { id: 20,Code:"", name: 'Tornado2',Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""}
    ];
    return {heroes,heroes2};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(accounts: Account[]): number {
    return accounts.length > 0 ? Math.max(...accounts.map(account => account.Id)) + 1 : 11;
  }
}
