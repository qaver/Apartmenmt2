import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TransactionComponent } from './components/transaction/transaction.component';
import { globalSettings } from './commondfiles/settings';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';
import { AccountTreeComponent } from './components/accounttree/accounttree.component';
import { AccountComponent } from './components/account/account.component';
import { ReportComponent } from './components/report/report.component';

export const routes: Routes = [

  { path: '', redirectTo: '/accountstree', pathMatch: 'full' },
  { path: 'account/:id', component: AccountComponent },
   { path: 'account/:id/:actype', component: AccountComponent },
  { path: 'transaction', component: TransactionComponent },
  { path: 'accountstree', component:AccountTreeComponent },
  { path: 'globalsettings', component:GlobalSettingsComponent },
  {path: 'reports', component:ReportComponent },
  { path: '**',   redirectTo: '/accountstree', pathMatch: 'full' }

];
export default routes;
/*

const routes: Routes = [
  { path: '', redirectTo: '/transaction', pathMatch: 'full' },
  { path: 'transaction', component: TransactionComponent },
  { path: 'detail/:id', component: AccountComponent },
  { path: 'accountstree', component: AccountTreeComponent }
];

*/
