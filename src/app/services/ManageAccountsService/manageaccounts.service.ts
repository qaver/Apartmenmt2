//import { provideAnalytics } from '@angular/fire/analytics';
import { Account, GeneralLedgerRecord,IncExpAccountRecord,IncExpStatmentRecord } from '../../commondfiles/commondef';
import { GlobalsettingsService } from '../globalsettings/globalsettings.service';
import { Injectable } from '@angular/core';
//import { HttpClient, /*HttpErrorResponse, HttpHeaders*/ } from '@angular/common/http';

import { Observable, /*OperatorFunction, concat,*/ of } from 'rxjs';
///import { catchError, concatAll, concatMap, debounce, debounceTime, exhaustMap, map, mergeAll, mergeMap, switchMap, tap } from 'rxjs/operators';

import { MessageService } from '../message/message.service';
///import { RequestInfo } from 'angular-in-memory-web-api';
///import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';


@Injectable({ providedIn: 'root' })
export class ManageAccountsService {
  //[x: string]: any;

  //private heroesUrl = 'api/heroes2';  // URL to web api
  //private heroesLocalServerUrl:string = 'http://localhost:3000/';
 // private heroesLocalServerUrl:string = 'https://qaver.github.io/test1/';

   /*httpOptions = {
    headers: new HttpHeaders({ Accept: 'application/json',
                              'Content-Type': 'application/json',
                              responseType : 'json'  })
  };
  httpOptins2 = {headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'Bearer your_access_token',

    // Add any additional headers as needed
  })
   };
   headers2 = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_access_token',
    // Add any additional headers as needed
  });*/
  constructor(
    private globalsettingsService:GlobalsettingsService,
   /* private http: HttpClient,*/
    private messageService: MessageService) { }

  /** GET heroes from the server */
  /*async getHeroesFromLocalServer(): Promise<Account[]>
   {
    let url:string = this.heroesLocalServerUrl +this.global settingsService.getDatabaseName();
    console.log(url);
    const data = await fetch(url);
    this.messageService.add('HeroService(localsrvr1): fetched heroes',{id:0,name:""});
    return await data.json() ?? <Account[]>[];
  }
  getHeroes(): Observable<Account[]>
  {
    this.heroesUrl = 'api/'+this.global settingsService.getDatabaseName();
    console.log(this.heroesUrl);
    return this.http.get<Account[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Account[]>('getHeroes', []))
      );
  }*/
  async getAccountsFromSQLServerWithFetch(fieldName:string,fieldValue:string,getAllAccounts:boolean): Promise<Account[]>
   {
    let url:string = "http://localhost:3000/api/data/account/"+fieldName+"/"+fieldValue;
    if (getAllAccounts)
      url = "http://localhost:3000/api/data/account/Name/positive";
    if (this.globalsettingsService.getUrl().trim() != "")
    {
      url = this.globalsettingsService.getUrl().trim()+"/api/data/account/"+fieldName+"/"+fieldValue;
      if (getAllAccounts)
        url = this.globalsettingsService.getUrl().trim()+"/api/data/account/Name/positive";
    }
   /* console.log("getAccounts   ",url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        // Add any additional headers if needed
      }});*/
      try {
            const data = await fetch(url);
   /// this.messageService.add('HeroService(localsqlsrvr1): fetched heroes',{id:0,name:""});
    ///console.log("before");
   // this.http.get<Hero[]>("http://localhost:3000/api/data/get") .subscribe(heroes => console.log(heroes));
  /// const request$ = this.http.get(url).pipe(take(1));

    ///console.log("bf");
   /// console.log(request$);
   /// console.log("after wrew");
    //return await lastValueFrom<Hero[]>(request$);
    //console.log(hero);
     /*.subscribe(Heroes => {
      console.log(Heroes);
    });*/

     /* .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      ));*/
     /// console.log("after");
         /// if (!data.ok)
          /// {
      // If not successful, throw an error to be caught below
        ///    const errorDetails = await data.json().catch(() => data.statusText); // Attempt to parse error details, fall back to statusText
         //  throw new Error(`HTTP error! Status: ${data.status}. Details: ${typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)}`);
       /// }
         return await data.json() ?? <Account[]>[];
      }
     catch (error)
     {
      console.error('Error to get records:', error);
       this.messageService.add(`${url} not reachable error=.${error}`,{Id:-155,Msg:"error"});
    }
    return [];
  }
  async getAccountFromSQLServerWithFetch(id:number): Promise<Account>
   {
    let url:string = "http://localhost:3000/api/data/account/id/"+id;
    if (this.globalsettingsService.getUrl().trim() != "")
      url = this.globalsettingsService.getUrl().trim() + "/api/data/account/id/"+id;
      console.log("get account with id ",url);
    const data = await fetch(url);
    const dataJSon = await data.json();
    let  Accounts =  <Account[]> dataJSon;
    let account:Account = {Id:-155,Code:"Not Found",Name:"Not Found",Tenant:"",Email:"",PhoneNo:"",AcType:"",ParentName:"",Address1:"",Address2:"",Address3:""};
    if (Accounts.length <= 0)
    {
      this.messageService.add(`Account not found.${account.Name}`,{Id:account.Id,Msg:account.Name});
      return account;
    }
    account = Accounts[0];
    console.log(account);
    if (account.Id === -155)
      this.messageService.add(`Account not found.${account.Name}`,{Id:account.Id,Msg:account.Name});
   /// else
    ///  this.messageService.add(` id=${account.Id} name=${account.Name}`,{id:account.Id,name:account.Name});


    return account;
  }
  /*async AddOrUpdateAccountFromSQLServerWithFetch2(account: Account): Promise<Account>
 {
  let url:string = "http://localhost:3000/api/data";
  if (account.Id ==-50001) // add account
      url = "http://localhost:3000/api/data/account/add";
  if (this.global settingsService.getUrl() != "")
  {
    if (account.Id ==-50001) // add account
      url = this.global settingsService.getUrl()+"/api/data/account/add";
     else
       url = this.global settingsService.getUrl()+"/api/data/account/edit";
  }
  console.log("post from ",url);

  const data = await fetch(url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed
    },
    body: JSON.stringify(account),
  });
 console.log(data);
 //if (data.status != 200)
/// {
///  this.messageService.add(`HeroService(localsqlsrvr1):Faied To Add Hero. ${data.id}`,{"id":-155,"name":data.statusText});
 ///  return {"id":-155,"name":data.statusText};
// }
  const dataJSon = await data.json();
  account =  <Account> dataJSon;
  if (account.Id === -155)
    this.messageService.add(`HeroService(localsqlsrvr1): Failed to add Account.${account.Name}`,{id:account.Id,name:account.Name});
  else
    this.messageService.add('HeroService(localsqlsrvr1): Added Account',{id:account.Id,name:account.Name});
  return account;
}*/
async AddOrUpdateAccountFromSQLServerWithFetch(account: Account): Promise<Account>
 {
  let url:string = "http://localhost:3000/api/data/account/edit";
  let trType:string = "Update Account";
  if (account.Id ==-50001) // add account
  {
      url = "http://localhost:3000/api/data/account/add";
       trType = "Add Account";
  }
  if (this.globalsettingsService.getUrl().trim() != "")
  {
     if (account.Id === -50001) // add account
      url = this.globalsettingsService.getUrl().trim()+"/api/data/account/add";
     else
       url = this.globalsettingsService.getUrl().trim()+"/api/data/account/edit";
  }
  console.log("put from ",url);
  const data = await fetch(url,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed
    },
    body: JSON.stringify(account),
  });
 console.log("data my"+JSON.stringify(account));
 /*if (data.status != 200)
 {
  this.messageService.add(`HeroService(localsqlsrvr1):Faied To Add Hero. ${data.id}`,{"id":-155,"name":data.statusText});
   return {"id":-155,"name":data.statusText};
 }*/
  const dataJSon = await data.json();
  let account1 =  <{Id:-155,Name:""}> dataJSon;
  console.log("ret val ="+account1.Name,account1.Id)
  if (account1.Id === -155)
    this.messageService.add(`Account Master:: Failed to ${trType}.${account1.Name}`,{Id:account.Id,Msg:account.Name});
  else
    this.messageService.add(`Account Master: ${trType} suceeded`,{Id:account1.Id,Msg:account1.Name});
  let account2:Account = account;
  account2.Id = account1.Id;
  return account2;
}
async deleteAccountFromSQLServerWithFetch(account: Account): Promise<Account>
 {
  let url:string = "http://localhost:3000/api/data/account/delete";
  if (this.globalsettingsService.getUrl().trim() != "")
      url = this.globalsettingsService.getUrl().trim() + "/api/data/account/delete";
      console.log("delete from ",url);
  const data = await fetch(url,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed
    },
    body: JSON.stringify(account),
  });
 ///console.log(data);
 /*if (data.status != 200)
 {
  this.messageService.add(`HeroService(localsqlsrvr1):Faied To Add Hero. ${data.id}`,{"id":-155,"name":data.statusText});
   return {"id":-155,"name":data.statusText};
 }*/
  const dataJSon = await data.json();
  let retValue = {Id:-11,Name:""};
  let account1 =  <{Id:-155,Name:""}> dataJSon;

  console.log("this is "+data.status + dataJSon);
  if (account1.Id === -155)
    this.messageService.add(`Account Master: Failed to delete.'${account.Name}' .${account1.Name}`,{Id:account.Id,Msg:account.Name});
  else
    this.messageService.add('Account Master: Account Deleted.'+account.Name,{Id:account.Id,Msg:account.Name});
  let account2 = account;
   account2.Id = account1.Id;
  return account2;
}
 async getGeneralLedgerFromSQLServerWithFetch(fromDate:string,toDate:string,groupName:string,accountName:string): Promise<GeneralLedgerRecord[]>
   {
    ///http://localhost:3000/api/data/report/generalledger/:2025-1-1/2025-12-1/:/:
    let url:string = "http://localhost:3000/api/data/report/generalledger/"+fromDate+"/"+toDate+"/"+groupName+"/"+accountName;

    if (this.globalsettingsService.getUrl().trim() != "")
      url = this.globalsettingsService.getUrl().trim() +"/api/data/report/generalledger/"+fromDate+"/"+toDate+"/"+groupName+"/"+accountName;
    console.log("get general ledger ",url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        // Add any additional headers if needed
      }});
    const data = await fetch(url);
    console.log(data);
    return await data.json() ?? <GeneralLedgerRecord[]>[];
  }
  async getIncomeExpenseReport(fromDate:string,toDate:string,groupName:string,accountName:string): Promise<IncExpAccountRecord[]>
   {
    ///http://localhost:3000/api/data/report/incexpstmt/2025-01-01/2025-12-01
    let url:string = "http://localhost:3000/api/data/report/incexpstmt/"+fromDate+"/"+toDate;

    if (this.globalsettingsService.getUrl().trim() != "")
      url = this.globalsettingsService.getUrl().trim() +"/api/data/report/incexpstmt/"+fromDate+"/"+toDate;
    console.log("get income expense stmt ",url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        // Add any additional headers if needed
      }});
    const data = await fetch(url);
    console.log(data);
    return await data.json() ?? <IncExpStatmentRecord[]>[];
  }
  /*getHeroesFromSQLServer(): Observable<Hero[]>
  {
    let url:string = "http://localhost:3000/api/data/master/Name/all";
    const options = { withCredentials: true as const ,Accept: 'application/json' as const,
    'Content-Type': 'application/json'as const};
    const httpOptionsNew = {
      headers: new HttpHeaders({ Accept: 'application/json' as const,
                                'Content-Type': 'application/json'as const,
                                responseType : 'json' as const  })};





   /// return this.http.get<any>("http://localhost:3000/api/data/get",options).pipe(
     /// tap(_ => this.log('fetched heroes'))
     // ,catchError(this.handleError<Hero[]>('getHeroesFromSQLServer', []))

    ///);
    let a = of([1,2,3,4]).pipe(map(item => item.filter(val => val > 2)));

    console.log("a ",a.forEach(v=> console.log(v)));


    let b = of ([1,2,3,4]).pipe(switchMap(async (item) => item.forEach(v => { v =v*2;console.log("v=",v)}))).subscribe();

    let b2 = of ([{id:1,name:"A1"},{id:2,name:"A2"},{id:3,name:"A3"},{id:4,name:"A4"}]).pipe
    (switchMap(async (heroes) => heroes.forEach(hero => { hero.id =hero.id*10;console.log("hero=",hero)}))).subscribe();

    const heroes1:Hero[] = [{id:100,name:"H1"},{id:200,name:"H2"}];
    console.log("ORIGINAL HEROES = ",heroes1);
    const observable = new Observable<Hero[]>((subscriber) =>
    {
      subscriber.next(heroes1);
      subscriber.next([{id:30,name:"C30"},{id:40,name:"C40"},{id:50,name:"C50"},{id:60,name:"C60"}]);
    }).pipe(map(item => item.filter(hero => hero.id >= 26))).subscribe();
    console.log("HEROES 0 = ",heroes1);
    ///const h1 = new Observable<Hero>((subscriber) =>
    ///{
    //  subscriber.next({id:26,name:"bba12"});
     // subscriber.next({id:22,name:"bba12"});
     // subscriber.next({id:24,name:"bba12"});
    //  subscriber.next({id:28,name:"bba12"});
    ///}).pipe(map(hero => hero.id > 24));

    const observable2 = new Observable<Hero[]>((subscriber) =>
    {
      subscriber.next(heroes1);
      subscriber.next([{id:-10,name:"D1"},{id:-20,name:"D2"}]);
    }).pipe();

    let ob2 = new Observable<Hero[]>((subscriber) =>
    {
      subscriber.next(heroes1);
      subscriber.next([{id:-100,name:"E1"},{id:-200,name:"E2"}]);
    }).pipe(
      debounceTime(100),
      switchMap(async (heroes) => heroes.forEach((hero:Hero) => { hero.id =hero.id*10;hero.name += "KKL";console.log( "SWITCHMAP.hero=",hero)}))
    ).subscribe();

    console.log("HEROES1 = ",heroes1);
    let ob3 = new Observable<Hero[]>((subscriber) =>
    {
      subscriber.next(heroes1);
      subscriber.next([{id:-70,name:"F1"},{id:-80,name:"F2"}]);
    }).pipe
    (
      debounceTime(1000),
      mergeMap(async (heroes) => heroes.forEach((hero:Hero) => { hero.id =hero.id*10;hero.name += "abc";console.log( "MERGE MAP.hero=",hero)}))
    ).subscribe();
    console.log("HEROES2 = ",heroes1);
    let ob4 = new Observable<Hero[]>((subscriber) =>
    {
      subscriber.next([{id:-90,name:"Gg1"},{id:90,name:"Gg2"}]);
      subscriber.next([{id:-90,name:"G1"},{id:90,name:"G2"}]);
      subscriber.next(heroes1);
      subscriber.next([{id:-90,name:"gg2"},{id:90,name:"gg2"}]);
    }).pipe
    (
      concatMap(async (heroes) => heroes.forEach((hero:Hero) => { hero.id =hero.id*10;hero.name += "XYZ";console.log( "CONCATMAP.hero=",hero)}))
    ).subscribe();
   // return ob3;
   console.log("HEROES3 = ",heroes1);

   let ob5 = new Observable<Hero[]>((subscriber) =>
    {
      subscriber.next([{id:-90,name:"Gg1"},{id:90,name:"Gg2"}]);
      subscriber.next([{id:-90,name:"Gg1"},{id:90,name:"Gg2"}]);
      subscriber.next(heroes1);
      subscriber.next([{id:-91,name:"H1"},{id:91,name:"H2"}]);
    }).pipe
    (
      exhaustMap(async (heroes) => heroes.forEach((hero:Hero) => { hero.id =hero.id*10;hero.name += "exh";console.log( "exhuastmap.hero=",hero)}))
    ).subscribe();
   // return ob3;
   console.log("HEROES4 = ",heroes1);



    return observable2;
    //return this.http.get<any>("http://localhost:3000/api/data/get",options);
    ///return this.http.get<Hero[]>(url)
    ///  .pipe(
     ///   tap(_ => this.log('fetched heroes')),
     ///   catchError(this.handleError<Hero[]>('getHeroes', []))
     /// );

      ///let promise = new Promise<Hero[] | void>((resolve, reject) => {
     /// let  res = this.http.get(url)
      ///    .toPromise()
       ///   .then(
       ///     res => { // Success
       ///       if (res)
        ///      {
         //      console.log(JSON.stringify(res));
         ///       resolve();
         //     }
         //   }
        ///  );
      ///});
     /// return <Hero[]>[];
  }*/

  /** GET hero by id. Return `undefined` when id not found */
/*getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }*/

  /** GET hero by id. Will 404 if id not found */
  /*getHero(id: number): Observable<Account> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Account>(url).pipe(
      tap(_ => this.log(`fetched Account id=${id}`)),
      catchError(this.handleError<Account>(`getAccount id=${id}`))
    );
  }*/

  /* GET heroes whose name contains search term */
 /* searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }*/
//post to json server
/*
AddHeroJsonServer(hero: Hero): Observable<Hero>
{
  let url:string = this.heroesLocalServerUrl +this.global settingsService.getDatabaseName();
    console.log(url,hero);
    return this.http.post<Hero>(url, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  addHeroSqlServer(hero: Hero): Observable<Hero>
  {
   let url:string = "http://localhost:3000/api/data";
   console.log(url,hero);
   return this.http.post<Hero>(url, hero, this.httpOptions).pipe(
    tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<Hero>('addHero')));
 }
*/
  /*  let postString:string =  "{ method: 'POST',headers: {'Content-Type': 'application/json', }body:";
    postString += JSON.stringify({'id': 25,'name': 'John'});
    ///const data = await fetch(url,postString);
    this.messageService.add('HeroService(localsrvr1): fetched heroes',{id:0,name:""});
    return await data.json() ?? data.json();*/
 /* fetch(URL_HERE, { method: 'POST',headers: {'Content-Type': 'application/json', }body: JSON.stringify({
       'ID': 2,
       'Name': 'John',
       'lastName': 'Doe'
    })
}).then(response => response.json())*/

  //////// Save methods //////////

  /** POST: add a new hero to the server */
 /* addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
*/
  /** DELETE: delete the hero from the server */

  /*deleteHeroJsonServer(id: number): Observable<Hero> {

    const url = `${this.heroesLocalServerUrl}${this.global settingsService.getDatabaseName()}/${id}`;
    console.log(url);

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
*/
  /** PUT: update the hero on the server */
/*  updateHero(account: Account): Observable<any> {
    return this.http.put(this.heroesUrl, account, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${account.Id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
*/
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Account: ${message}`,{Id:0,Msg:''});
  }
}
function take(arg0: number): import("rxjs").OperatorFunction<Object, unknown> {
  throw new Error('Function not implemented.');
}

/*function lastValueFrom<T>(request$: Observable<unknown>): Hero[] | PromiseLike<Hero[]> {
  throw new Error('Function not implemented.');
}

function from(arg0: number, arg1: number, arg2: number, arg3: number) {
  throw new Error('Function not implemented.');
}

function pipe(arg0: OperatorFunction<unknown, any>): any {
  throw new Error('Function not implemented.');
}*/

