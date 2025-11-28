import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Account } from '../commondfiles/commondef';
import { ManageAccountsService } from '../services/ManageAccountsService/manageaccounts.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-hero-search',
    imports: [FormsModule, RouterLink, CommonModule],
    templateUrl: './hero-search.component.html',
    styleUrl: './hero-search.component.css'
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Account[]>;
  private searchTerms = new Subject<string>();

  constructor(private accountsService: ManageAccountsService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    /*this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      //switchMap((term: string) => this.heroService.searchHeroes(term)),
    );*/
  }
}
