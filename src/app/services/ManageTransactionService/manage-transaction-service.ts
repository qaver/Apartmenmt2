import { Injectable } from '@angular/core';
import { GlobalsettingsService } from '../globalsettings/globalsettings.service';
import {TransactionRecord,CodeName, ErrorMsg, VoucherList} from "../../commondfiles/commondef"
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, OperatorFunction, concat, of } from 'rxjs';
import { catchError, concatAll, concatMap, debounce, debounceTime, exhaustMap, map, mergeAll, mergeMap, switchMap, tap } from 'rxjs/operators';

import { MessageService } from '../message/message.service';
import { sqliteDatabaseService } from '../sqllite3/sqlite3.service';

@Injectable({
  providedIn: 'root'
})
export class ManageTransactionService {
  dbName:string = "D:/JsServer/Sqllite3/apartment/apartment.db"
  constructor(
    private globalsettingsService:GlobalsettingsService,
    private http: HttpClient,
    private messageService: MessageService,private sqllite:sqliteDatabaseService) { }

     async getLastVouhcerNoFromDatabase(voucherPrefix:string): Promise<string>
    {
      if (voucherPrefix === "")
        return "1";
        let url:string = "http://localhost:3000/api/data/transaction/lastvoucher/"+voucherPrefix;

        if (this.globalsettingsService.getUrl() != "")
          url = this.globalsettingsService.getUrl()  + "/api/data/transaction/lastvoucher/"+voucherPrefix;
        console.log("get voucher ",url,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            // Add any additional headers if needed
          }});
        const data = await fetch(url);
        const dataJSon = await data.json();
        let msg =  <ErrorMsg> dataJSon;

        if (msg.Id === -155)
        {
          this.messageService.add(`Transaction:: Failed to get last voucherNo.${voucherPrefix}. ${msg.errMsg}`,{Id:1,Msg:voucherPrefix});
          return "";
        }

        console.log(msg.errMsg);
        return msg.errMsg;
      }
    async getVoucherFromDatabase(voucherNo:string): Promise<TransactionRecord[]>
    {

      if (this.globalsettingsService.getUseLocalDatabase())
      {
          return this.sqllite.getVoucher(this.dbName,voucherNo);
      }

        let url:string = "http://localhost:3000/api/data/transaction/"+voucherNo;

        if (this.globalsettingsService.getUrl() != "")
          url = this.globalsettingsService.getUrl()  + "/api/data/transaction/"+voucherNo;
        console.log("get voucher ",url,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            // Add any additional headers if needed
          }});
        const data = await fetch(url);

        return await data.json() ?? <TransactionRecord[]>[];
      }
      async saveVoucherToDatabase(trasactions:TransactionRecord[],edit:boolean): Promise<ErrorMsg>
      {

        console.log(trasactions);
          let url:string = "http://localhost:3000/api/data/transaction/add"
           let trType:string = "Add Voucher";
           if (edit) // edit voucher
           {
               url = "http://localhost:3000/api/data/transaction/edit";
                trType = "Edit Voucher";
           }
           if (this.globalsettingsService.getUrl() != "")
           {
               if (edit)
                 url = this.globalsettingsService.getUrl()+"/api/data/transaction/edit";
              else
                url = this.globalsettingsService.getUrl()+"/api/data/transaction/add";
           }
           console.log("put from ",url);
           const data = await fetch(url,{
             method: 'PUT',
             headers: {
               'Content-Type': 'application/json',
               // Add any additional headers if needed
             },
             body: JSON.stringify(trasactions),
           });

           const dataJSon = await data.json();
           let errMsg =  <ErrorMsg> dataJSon;

           if (errMsg.Id === -155)
             this.messageService.add(`Transaction:: Failed to ${trType} (${trasactions[0].VoucherNo}). ${errMsg.errMsg}`,{Id:1,Msg:trasactions[0].VoucherNo});
           else
             this.messageService.add(`Transaction Master: ${trType} (${trasactions[0].VoucherNo}) suceeded`,{Id:1,Msg:trasactions[0].VoucherNo});

           console.log(errMsg);
           return errMsg;
      }
       async getAccounts(voucherPrefix:string,account1OrAccount2:string): Promise<CodeName[]>
       {
        let url:string = "http://localhost:3000/api/data/transaction/accounts/"+voucherPrefix+"/"+account1OrAccount2;
        //console.log(url);
        if (this.globalsettingsService.getUrl() != "")
          url = this.globalsettingsService.getUrl()  + "/api/data/transaction/accounts/"+voucherPrefix+"/"+account1OrAccount2;
        console.log("get Accounts ",url,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            // Add any additional headers if needed
          }});
        const data = await fetch(url);

        return await data.json() ?? <TransactionRecord[]>[];
      }
      async getVoucherList(voucherPrefix:string): Promise<VoucherList[]>
       {
        let url:string = "http://localhost:3000/api/data/transaction/voucherlist/"+voucherPrefix;
        //console.log(url);
        if (this.globalsettingsService.getUrl() != "")
          url = this.globalsettingsService.getUrl()  + "/api/data/transaction/voucherlist/"+voucherPrefix;
        console.log("get Accounts ",url,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            // Add any additional headers if needed
          }});
        const data = await fetch(url);

        return await data.json() ?? <VoucherList[]>[];
      }
      async deleteVoucherFromDatabase(voucherNo:string): Promise<ErrorMsg>
      {
       let url:string = "http://localhost:3000/api/data/transaction/delete/"+voucherNo
        if (this.globalsettingsService.getUrl() != "")
            url = this.globalsettingsService.getUrl() + "/api/data/transaction/delete/"+voucherNo;
            console.log("delete from ",url);
        const data = await fetch(url,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
          },
        });

       const dataJSon = await data.json();
        let errMsg =  <ErrorMsg> dataJSon;

        if (errMsg.Id === -155)
          this.messageService.add(`Transaction:: Failed to delete voucher.${voucherNo}. ${errMsg.errMsg}`,{Id:1,Msg:voucherNo});
        else
          this.messageService.add(`Transaction: Delete voucher (${voucherNo})  suceeded,`,{Id:1,Msg:voucherNo});

        console.log(errMsg);
        return errMsg;
      }
}
