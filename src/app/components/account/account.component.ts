import { GlobalsettingsService } from '../../services/globalsettings/globalsettings.service';
//import { globalSettings } from '../../commondfiles/settings';
import { MessageService } from '../../services/message/message.service';
import { CommonModule } from '@angular/common';
import { Component,Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule,FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { Account} from '../../commondfiles/commondef';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ManageAccountsService } from '../../services/ManageAccountsService/manageaccounts.service';
////import { SettingsService } from '../../services/settings/settings.service';
import { MessagesComponent } from "../messages/messages.component";

@Component({
    selector: 'app-account',
    imports: [FormsModule, CommonModule, ReactiveFormsModule,MessagesComponent],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  account: Account = {
    Id: 0,
    Code: '',
    Name: '',
    Tenant: '',
    Email: '',
    PhoneNo: '',
    AcType: '',
    ParentName: '',
    Address1: '',
    Address2: '',
    Address3: ''
  };
  actype:string = "";
  // userProfileForm!: FormGroup;
  /* checkoutForm = this['formBuilder'].group({
    name: '',
    address: ''
  });*/

  checkoutForm = this.formBuilder.group({
    Code: ['', Validators.required],
    Name: ['', Validators.required],
    Type: ['', Validators.required],
    Email: [''],
    PhoneNo: [''],
    Tenant: [''],
    Address1: [''],
    Address2: [''],
    Address3: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private accountsService: ManageAccountsService,
    private location: Location,
    private globalsettingsService:GlobalsettingsService,
    private formBuilder: FormBuilder,
    private message:MessageService
  ) {}

   onSubmit(): void {
    // Process checkout data here

    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
    this.checkoutForm.value.Code =  this.account?.Code;
  }
validateAccountType()
{
  let text = this.actype;
   if ((text === 'Accounts') ||(text === 'General')||(text === 'Debtor')||(text === 'Creditor')||(text === 'Income')||(text === 'Expense')||(text === 'PettyCash')||(text === 'Cash')||(text === 'Bank'))
   {
   }
   else
   {
     this.actype = "";
   }
}
  ngOnInit(): void {
    this.getAccount();
   /* this.userProfileForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'address': new FormControl(null),
      'country': new FormControl(null, Validators.required) // Add the new form control
    });*/
  }

  getAccount(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    if (id == -50001) // add account
    {
        this.actype  = this.route.snapshot.paramMap.get('actype')!;
       console.log(this.actype);
       let parentname:string = this.actype;
       this.account = {Id:id,Code:"New1",Name:"New1",Tenant:"",Email:"",PhoneNo:"",AcType:this.actype,ParentName:parentname,Address1:"",Address2:"",Address3:""}
       console.log(this.account);
       return;
    }

//edit account
    this.accountsService.getAccountFromSQLServerWithFetch(id).then((account =>
    {
      this.message.clear();
      if (account.Id != -155)
      {
        console.log("found Account as ",account);
        this.account = account;//edit account
        this.actype = account.AcType;
      }
      else
      {

      }

    }));
  }

  goBack(): void
  {
    this.message.clear();
    this.location.back();

  }

  save(): void
  {
    if (!this.account)
      return;
    console.log("thisacc new",this.account.Id);
     this.account.AcType = this.actype
     this.account.ParentName = this.account.AcType;
      let OldId = this.account.Id;
      console.log(this.account);
      console.log("acc parent",this.actype);
      this.accountsService.AddOrUpdateAccountFromSQLServerWithFetch(this.account).then((newAccount =>
      {
        let newId = newAccount.Id;
        this.account.Id = OldId;

        console.log("acc new",this.account.Id,OldId);
        if (newId !== -155)
        {
          if(OldId !== -50001) // add account else edit
          {
            this.goBack();
          }
          else
          {
              this.account.Code = "";
              this.account.Name = "";
              this.account.Email = "";
              this.account.PhoneNo = "";
              //this.account.ParentName = "";
             // this.account.AcType = "";
              this.account.Tenant = "";
              this.account.Address1 = "";
              this.account.Address2 = "";
              this.account.Address3= "";
              console.log(newAccount);
          }
        }
        else
        {
           /// console.log(account.Name);
        }

      }));
    }
  delete(): void
    {
      if (!this.account)
        return;
        this.accountsService.deleteAccountFromSQLServerWithFetch(this.account).then((account1 =>
        {
          if (account1.Id != -155)
          {
            this.goBack();
          }
          else
          {
              console.log("ttth"+account1.Id);
          }

        }));
      }
}
