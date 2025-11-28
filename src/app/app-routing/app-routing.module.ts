//import { Account } from '../commondfiles/commondef';
import { ROUTER_CONFIGURATION, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
///import { CommonModule } from '@angular/common';
import { AccountTreeComponent } from '../components/accounttree/accounttree.component';
import { TransactionComponent } from '../components/transaction/transaction.component';
import { AccountComponent } from '../components/account/account.component';
import { ReportComponent } from '../components/report/report.component';

export const routes: Routes = [
  { path: '', redirectTo: '/transaction', pathMatch: 'full' },
  { path: 'transaction', component: TransactionComponent },
  { path: 'detail/:id', component: AccountComponent },
  { path: 'detail/:id/type', component: AccountComponent },
  { path: 'accountstree', component: AccountTreeComponent},
  {path: 'reports', component:ReportComponent }
  ];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule { }
