import { settings } from '../../commondfiles/settings';
import { Account } from '../../commondfiles/commondef';
import { AccountComponent } from '../account/account.component';
import { GlobalsettingsService } from '../../services/globalsettings/globalsettings.service';
import { SettingsService } from '../../services/settings/settings.service';

import { Component, Output,EventEmitter, SimpleChanges, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {HEROES} from "../../commondfiles/mock_Heroes"
import { AppComponent } from '../../app.component';
import { ManageAccountsService } from '../../services/ManageAccountsService/manageaccounts.service';
import { MessageService } from '../../services/message/message.service';
import { RouterLink, RouterModule } from '@angular/router';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { ThemeSwitcher } from '../../commondfiles/themeswitcher';
import { Accordion } from "primeng/accordion";
import { MessagesComponent } from "../messages/messages.component";

@Component({
    selector: 'app-accountstree',
    standalone: true, // Or false if part of a module
    imports: [FormsModule, RouterLink, RouterModule, TreeTableModule /*ImportsModule*/, ThemeSwitcher, MessagesComponent],
    providers: [],
    templateUrl: './accounttree.component.html',
    styleUrl: './accounttree.component.css'
})

export class AccountTreeComponent implements OnInit {
  accounts: Account[] = [];
  accounts2: Account[] = [];
  files!: TreeNode[];
  accountnodes!: TreeNode[];
   private convertRecordsetToTreeNodes(recordset: Account[], ParentName:string): TreeNode[] {
   // console.log("Parent = "+ParentName);
    // (Paste the conversion function here or import it)
    const tree: TreeNode[] = [];
    const children = recordset.filter(item => item.ParentName === ParentName);
    //console.log("children = "+children);
    for (const child of children) {
      const node: TreeNode = {
        data: child,
        label: child.Name,
        children: this.convertRecordsetToTreeNodes(recordset, child.Name),
        expanded: false
      };
      tree.push(node);
    }
    return tree;
  }
  constructor(public globalsettingsService:GlobalsettingsService,private accountsService: ManageAccountsService,private message:MessageService) { }

  ngOnInit(): void {
    this.getAccounts();

   /// this.nodeService.getFilesystem().then((files: TreeNode<any>[]) => (this.files = files));

  }

  getAccounts(): void
  {
   /* if (this.globalsettingsService.getUseMemoryDatabase())
    {
       this.accountsService.getHeroes()
      .subscribe({next:(accounts) =>{ this.accounts = accounts; console.log("getting heroes from memory")},
                  error:(err) => console.log(err),
                complete:()=>console.log("complete get heroes")});

      //this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
      // both of the above stmts do one and the same thing;;
      return;
    }
    else if (this.globalsettingsService.getUseSQLServerDatabase())
    {
      if (this.globalsettingsService.getUseFetchCommand())
      {
        this.heroService.getAccountsFromSQLServerWithFetch("","",true).then((accounts: Account[]) =>
        {
          this.accounts = accounts;


          this.accounts.unshift({Id:-100001,Code:"General",Name:"General",Tenant:"",Email:"",PhoneNo:"",AcType:"General",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100004,Code:"Income",Name:"Income",Tenant:"",Email:"",PhoneNo:"",AcType:"Income",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100005,Code:"Expense",Name:"Expense",Tenant:"",Email:"",PhoneNo:"",AcType:"Expense",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100007,Code:"PettyCash",Name:"PettyCash",Tenant:"",Email:"",PhoneNo:"",AcType:"PettyCash",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100008,Code:"Cash",Name:"Cash",Tenant:"",Email:"",PhoneNo:"",AcType:"Cash",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100009,Code:"Bank",Name:"Bank",Tenant:"",Email:"",PhoneNo:"",AcType:"Bank",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100003,Code:"Creditor",Name:"Creditor",Tenant:"",Email:"",PhoneNo:"",AcType:"Creditor",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100002,Code:"Debtor",Name:"Debtor",Tenant:"",Email:"",PhoneNo:"",AcType:"Debtor",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100000,Code:"Accounts",Name:"Accounts",Tenant:"",Email:"",PhoneNo:"",AcType:"Accounts",ParentName:"",Address1:"",Address2:"",Address3:""});

         // const children = accounts.filter(item => item.ParentName === "Accounts");
          //console.log("accounts"+children.length);
           this.accountnodes = this.convertRecordsetToTreeNodes(this.accounts,"Accounts");

        })
      }
      else
      {
        this.accounts  = [];
        this.heroService.getHeroes FromSQLServer()
        .subscribe({
          next:(accounts) => this.heroes = this.heroes.concat(accounts),
          error:(err) => console.log("error happened ",err),
          complete:()=> console.log("sql server get completed")});
      }
      return;
    }
    else
    {
      this.heroService.getHeroes FromLocalServer().then((accounts: Account[]) =>
      {
        this.accounts = accounts;

      });
    }*/

      this.accountsService.getAccountsFromSQLServerWithFetch("","",true).then((accounts: Account[]) =>
      {
          this.accounts = accounts;


          this.accounts.unshift({Id:-100001,Code:"General",Name:"General",Tenant:"",Email:"",PhoneNo:"",AcType:"General",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100004,Code:"Income",Name:"Income",Tenant:"",Email:"",PhoneNo:"",AcType:"Income",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100005,Code:"Expense",Name:"Expense",Tenant:"",Email:"",PhoneNo:"",AcType:"Expense",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100007,Code:"PettyCash",Name:"PettyCash",Tenant:"",Email:"",PhoneNo:"",AcType:"PettyCash",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100008,Code:"Cash",Name:"Cash",Tenant:"",Email:"",PhoneNo:"",AcType:"Cash",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100009,Code:"Bank",Name:"Bank",Tenant:"",Email:"",PhoneNo:"",AcType:"Bank",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100003,Code:"Creditor",Name:"Creditor",Tenant:"",Email:"",PhoneNo:"",AcType:"Creditor",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100002,Code:"Debtor",Name:"Debtor",Tenant:"",Email:"",PhoneNo:"",AcType:"Debtor",ParentName:"Accounts",Address1:"",Address2:"",Address3:""});
          this.accounts.unshift({Id:-100000,Code:"Accounts",Name:"Accounts",Tenant:"",Email:"",PhoneNo:"",AcType:"Accounts",ParentName:"",Address1:"",Address2:"",Address3:""});

         // const children = accounts.filter(item => item.ParentName === "Accounts");
          //console.log("accounts"+children.length);
           this.accountnodes = this.convertRecordsetToTreeNodes(this.accounts,"Accounts");
           //console.log("getting accs.");
            console.log(this.accounts);

        });

  }
  add(name: string): void
   {
   /* name = name.trim();
    if (!name) { return; }
    if (this.globalsettingsService.getUseMemoryDatabase())
    {
      this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
    }
    else
    {
      if (this.globalsettingsService.getUseSQLServerDatabase())
      {
        if (this.globalsettingsService.getUseFetchCommand())
        {
          this.heroService.addHeroFromSQLServerWithFetch({ id:24,name:name } as Hero).then((hero =>
          {
            if (hero.id != -155)
            {
              this.heroes.push(hero);
            }
            else
            {
                console.log(hero.name);
            }

          }));
        }
        else
        {
          this.heroService.addHeroSqlServer({ id:24,name:name } as Hero)
          .subscribe(hero => {
            this.heroes.push(hero);
          });
        }
      }
      else
      {

        alert("Add not available for json:server databases");
        console.log("Add not available for json:server databases");
        let str1:string = ""
        let hero:Hero = {name:name,id:25};

        this.heroService.AddHeroJsonServer({ id:24,name:name } as Hero)
        .subscribe(hero => {
          this.heroes.push(hero);
        });
      }
    }*/
  }

  deleteAccount(id:number): void
  {

    console.log("delete");
    console.log(this.accounts);
    let account:Account = {
      Id: id,
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
    const temp:Account|undefined = this.accounts.find(item => item.Id === id )
   if (temp !== undefined)
    {
      account = temp;
      console.log(temp);
    }
    else
    {
        console.log("Account not found."+account.Name);
    }
    this.accountsService.deleteAccountFromSQLServerWithFetch(account).then((account1 =>
    {
            if (account1.Id != -155)
            {
              console.log(this.accounts);
              this.accounts = this.accounts.filter(h => h.Id !== id);
              console.log("Account deleted."+id + "ACCS ");
              console.log(this.accounts);
              this.accountnodes = this.convertRecordsetToTreeNodes(this.accounts,"Accounts");
            }
            else
            {
               /// console.log("not deleted");
            }

          }));
  }
}

