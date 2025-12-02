import { globalSettings } from './../../commondfiles/settings';
import { ManageTransactionService} from '../../services/ManageTransactionService/manage-transaction-service';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { Component, OnInit,ViewChildren, QueryList , ElementRef } from '@angular/core';
import { ManageAccountsService } from '../../services/ManageAccountsService/manageaccounts.service';
import { Account, CodeName, CommonFileFunction, ErrorMsg, TransactionRecord,VoucherList,enumError,enumErrorText } from '../../commondfiles/commondef';
import { TreeTableModule } from "primeng/treetable";
import { ContextMenuModule } from "primeng/contextmenu";
import { Table, TableModule } from "primeng/table";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker'
import { DragDropModule } from "primeng/dragdrop";
import { FluidModule } from 'primeng/fluid';
import { MessagesComponent } from "../messages/messages.component";
import { MessageService } from '../../services/message/message.service';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import jsPDF from 'jspdf';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { EmailService } from '../../services/emailservice/emailservice.service';
import { GlobalsettingsService } from '../../services/globalsettings/globalsettings.service';

//import { RouterLink, RouterModule } from '@angular/router';
///import { globalSettings } from '../common/settings';
///import { GlobalSettingsComponent } from '../global-settings/global-settings.component';

interface headerGridType
{
   fieldHeading1:string;
   fieldValue1:string;
   fieldType1:number;

   fieldHeading2:string
   fieldValue2: string;
   fieldType2:number;
};
interface bodyGridType
{
   sno:number;
   account_Name: string;
   amount:number;
   drcr:string;
   narration:string;
   rctpmt:boolean;
};
interface Item {
  id: number;
  name: string;
  date: Date | null;
};

interface Product {
    code: string;
    name: string;
    category: string;
    inventoryStatus: string;
}
interface StatusOptionValue {
    label: string;
    value: string;
}
interface StatusOption {
    label: string;
    value: StatusOptionValue;
}
@Component({
    selector: 'app-transaction',
    imports: [/*RouterLink, HeroSearchComponent*/ FormsModule, FluidModule, CommonModule, TreeTableModule, TableModule, ContextMenuModule, SelectModule, DatePickerModule, DragDropModule, MessagesComponent],
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.css'
})

export class TransactionComponent implements OnInit
 {
  GRIDFIELDTYPE = {INVALID:0,TEXT:1,NUMERIC:2,DATEFIELD:3,SELECTION:4,LABEL:5,VOUCHERNO:5};
  account1:CodeName[] = [];
  account2:CodeName[] = [];
  headerGrid:headerGridType[] = [];
  bodyGrid: bodyGridType[] = [];
  bodyCols: any[] = [];
  prevVoucherNo:string = "";
  copyVoucherList:VoucherList[]= [];
  showCopyVoucherList:boolean = false;

  TRASACTIONTYPE = {COPYTRANSACTIONS:-200,TRANASACTONS:-100,RECEIPT:0,PAYMENT:1,JOURNALVOUCHER:2,OPENINGBALANCE:3,DEBITNOTE:4,
    CREDITNOTE:5,OPENINGSTOCK:6,SHORTAGEOFSTOCK:7,EXCESSOFSTOCK:8,STOCKTRANSFER:9};

  TRASACTIONTITLE = {COPYTRANSACTIONS:"Copy",TRANASACTONS:'Transactions',RECEIPT:'Receipt',PAYMENT:'Payment',JOURNALVOUCHER:'Journal Voucher',
    OPENINGBALANCE:'Opening Balance',DEBITNOTE:'Debit Note',CREDITNOTE:'Credit Note',OPENINGSTOCK:'Opening Stock',
    SHORTAGEOFSTOCK:'Shortage Of Stock',EXCESSOFSTOCK:'Excess Of Stock',STOCKTRANSFER:'Stock Transfer'};

 transactionType:number= this.TRASACTIONTYPE.TRANASACTONS;
 transactionTite:string = this.TRASACTIONTITLE.TRANASACTONS;
// oldTrType:number = this.transactionType;
 ///oldtrTitle:string = this.transactionTite;
 copyVoucherNo:string = "";

 rowsInTransactionGrid = 10;

  constructor(private transactionService:ManageTransactionService,private messageService: MessageService,private accountsService:ManageAccountsService,
    private emailService:EmailService,private globalsettingsService:GlobalsettingsService,
    private route:ActivatedRoute, private platform: Platform) {
      this.rowsInTransactionGrid = this.globalsettingsService.getRowsInTransactionGrid();
  }

 /*webAcsSelected:string = "";

  webAcsChange(event:any){
    this.webAcsSelected = event.value;
  }*/
  ConvertDateToYYYYMMDdFormat(date:string,errMsg:ErrorMsg):string
  {
    date.trim();

    if (date === "")
    {
      errMsg.Id = enumError.EMPTYDATE;
      return "";
    }
    if(date.length != 10)
    {
      errMsg.Id = enumError.INVALIDDATE;
      return "";
    }

    if ((date[2] !== '/') && (date[2] !== '-'))
    {
      errMsg.Id = enumError.INVALIDDATE;
      return "";
    }

    if ((date[5] !== '/') && (date[5] !== '-'))
    {
       errMsg.Id = enumError.INVALIDDATE;
       return "";
    }

    let date2:string = date[6]+date[7]+date[8]+date[9] + '-'+date[3]+date[4]+'-'+date[0]+date[1];

    return date2;
  }
   isRctPmtType()
   {
    if (this.transactionType === undefined)
    {
      return false;
    }
      if ((this.transactionType === this.TRASACTIONTYPE.RECEIPT)||(this.transactionType === this.TRASACTIONTYPE.PAYMENT))
        return true;
      return false;
   }
  setHeadings(trType:number)
  {
    this.bodyCols = [];
    ///this.headerCols  = [];
      if (this.isRctPmtType())
      {
        this.bodyCols =
         [
          { field: "sno", headerText: "SNo",hidden:false },
          { field: "account_Name", headerText: "Account Name",hidden:false },
          { field: "amount", headerText: "Amount",hidden:false },
          { field: "narration", headerText: "Narration",hidden:false},
        ];
      /*this.headerCols =
      [
          { field: "voucherNo", heaheaderTextder: "Voucher No",hidden:false,readonly:false,fieldType:this.FIELDTYPE.TEXT},
          { field: "voucherDate", headerText: "VoucherDate",hidden:false,readonly:false,fieldType:this.FIELDTYPE.DATEFIELD },
          { field: "account_Name", headerText: "Account Name",hidden:false,readonly:false,fieldType:this.FIELDTYPE.SELECTION },
          { field: "dueDate", headerText: "Due Date",hidden:false,readonly:false,fieldType:this.FIELDTYPE.DATEFIELD },
          { field: "narration", headerText: "Narration",hidden:false,readonly:false,fieldType:this.FIELDTYPE.TEXT},
          { field: "chequeNo", headerText: "Checque No",hidden:false,readonly:false,fieldType:this.FIELDTYPE.TEXT },
      ];*/
     }
     else
    {
        this.bodyCols = [
        { field: "sno", headerText: "SNo",hidden:false },
        { field: "account_Name", headerText: "Account Name",hidden:false },
        { field: "amount", headerText: "Amount",hidden:false },
         { field: "trTYpe", headerText: "Type",hidden:false },
        { field: "narration", headerText: "Narration",hidden:false},
         ];
     /*  this.headerCols =
       [
          { field: "voucherNo", headerText: "Voucher No",hidden:false,readonly:false,},
          { field: "voucherDate", headerText: "VoucherDate",hidden:false,readonly:false },
          { field: "account_Name", headerText: "Account Name",hidden:false,readonly:false },
          { field: "dueDate", headerText: "Due Date",hidden:false,readonly:true },
          { field: "narration", headerText: "Narration",hidden:false,readonly:false },
          { field: "chequeNo", headerText: "Checque No",hidden:false,readonly:false },
       ];*/
     }


  }
  getVoucherPrefix():string
  {
    if (this.transactionType == this.TRASACTIONTYPE.RECEIPT)
      return "RCV-";
     else if (this.transactionType == this.TRASACTIONTYPE.PAYMENT)
      return "PAV-";
    else if (this.transactionType == this.TRASACTIONTYPE.OPENINGBALANCE)
      return "OPN-";
    else if (this.transactionType == this.TRASACTIONTYPE.JOURNALVOUCHER)
      return "JRV-";
    else if (this.transactionType == this.TRASACTIONTYPE.DEBITNOTE)
      return "DRV-";
    else if (this.transactionType == this.TRASACTIONTYPE.CREDITNOTE)
      return "CRV-";

    return "";
  }
 setTransactionType(trType:number,trTitle:string):void
 {
    ///let oldVoucherPrefix = this.getVoucherPrefix();
    //this.oldTrType = this.transactionType;
   /// this.oldtrTitle = this.transactionTite;
    this.transactionType = trType;
    this.transactionTite = trTitle;
  //  this.headerGrid[0].fieldValue1 = this.getDefaultVoucherNo();
    if (trType === this.TRASACTIONTYPE.TRANASACTONS)
    {
      this.account1 = []
      this.account2= [];
      this.copyVoucherList = [];
      this.copyVoucherNo = "";
      this.headerGrid[0].fieldValue1  = "";
      this.messageService.clear();
    }
   /* else if (trType ===  this.TRASACTIONTYPE.COPYTRANSACTIONS)
    {
        this.getVoucherList(oldVoucherPrefix);
    }*/
    else
    {
      this.setHeadings(trType);
      this.clearGrid(true);
      this.getAccounts("account1");
      this.getAccounts("account2");
    }
 }
 getTransactionType():number
 {
   return this.transactionType;
 }
 getTransationTitle():string
 {
    return this.transactionTite;
 }
 transaction():void
 {
    this.setTransactionType(this.TRASACTIONTYPE.TRANASACTONS  ,this.TRASACTIONTITLE.TRANASACTONS);
 }
receipt():void
 {
    this.setTransactionType(this.TRASACTIONTYPE.RECEIPT,this.TRASACTIONTITLE.RECEIPT);
 }

 payment():void
 {
    this.setTransactionType(this.TRASACTIONTYPE.PAYMENT,this.TRASACTIONTITLE.PAYMENT);
 }
 openingBalance():void
 {
    this.setTransactionType(this.TRASACTIONTYPE.OPENINGBALANCE,this.TRASACTIONTITLE.OPENINGBALANCE);
 }
 journalVoucher():void
 {
    this.setTransactionType(this.TRASACTIONTYPE.JOURNALVOUCHER,this.TRASACTIONTITLE.JOURNALVOUCHER);
 }
 debitNote():void
 {
    this.setTransactionType(this.TRASACTIONTYPE.DEBITNOTE,this.TRASACTIONTITLE.DEBITNOTE);
 }
 creditNote():void
 {
    this.setTransactionType(this.TRASACTIONTYPE.CREDITNOTE,this.TRASACTIONTITLE.CREDITNOTE);
 }

  ngOnInit(): void {

      this.route.queryParams.subscribe(params =>
      {
        console.log("param = ",params['action']);
          if (params['action'] === 'payment')
          {
            this.payment();
          }
          else if (params['action'] === 'receipt')
          {
            this.receipt();
          }
          else if (params['action'] === 'openingvoucher')
          {
            this.openingBalance();
          }
          else if  (params['action'] === 'journalvoucher')
          {
            this.journalVoucher();
          }
          else if  (params['action'] === 'debitnote')
          {
            this.debitNote();
          }
          else if (params['action'] === 'creditnote')
          {
            this.creditNote();
          }
      });
  }
  getDefaultVoucherNo()
  {
      return "1";
  }
  getNextVoucherNo():string
  {
     return (Number(this.headerGrid[0].fieldValue1)+1).toString();
  }
  getCurrentDate()
  {
    const now = new Date();

      // Format using built-in locale methods (user's local time zone)
      ///this.currentDateTime = now.toLocaleString();
      // Example output: "11/18/2025, 7:28:15 PM" (format varies by browser/locale)

      // For a specific format (e.g., YYYY-MM-DD HH:MM:SS) you can build the string:
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const day = now.getDate().toString().padStart(2, '0');
    ///return "01/01/2025";
    return day.toString()+"/"+month.toString()+"/"+year.toString();
  }
  clearGrid(getNextVoucherNo:boolean)
  {
      let voucherNo = "";
     ///  this.prevVoucherNo = "";
      let rctpmt:boolean = this.isRctPmtType();
      if ( this.headerGrid[0])
        voucherNo = this.headerGrid[0].fieldValue1;
      this.headerGrid = [{ fieldHeading1: "Voucher No", fieldValue1:voucherNo,fieldType1:this.GRIDFIELDTYPE.TEXT,fieldHeading2: 'Voucher Date',fieldValue2: '',fieldType2:this.GRIDFIELDTYPE.DATEFIELD},
                                 { fieldHeading1: "Account Name", fieldValue1: '',fieldType1:this.GRIDFIELDTYPE.SELECTION,fieldHeading2: 'Due Date',fieldValue2: '',fieldType2:this.GRIDFIELDTYPE.DATEFIELD},
                                 { fieldHeading1: "Narration", fieldValue1: '',fieldType1:this.GRIDFIELDTYPE.TEXT,fieldHeading2: 'ChequeNo',fieldValue2: '',fieldType2:this.GRIDFIELDTYPE.TEXT}
                            ];
    if (!rctpmt)
    {
      this.headerGrid[1].fieldType1 = this.GRIDFIELDTYPE.LABEL;
      this.headerGrid[2].fieldType2 = this.GRIDFIELDTYPE.LABEL;
      this.headerGrid[1].fieldValue1 = TransactionRecord.GetJournalAccountName(this.transactionType);
    }
   /* this.headerGrid[0].col1 = this.get NextVoucherNo();
    this.headerGrid[0].col3 = this.getCurrentDate();
    this.headerGrid[1].col1 = "";
    this.headerGrid[1].col3 = this.getCurrentDate();
    this.headerGrid[2].col1 = "";
    this.headerGrid[2].col3 = "";*/

    this.resetChequeNoField();
    if (getNextVoucherNo)
    {
     /// this.headerGrid[0].fieldValue1 = this.getNextVoucherNo();
      this.transactionService.getLastVouhcerNoFromDatabase(this.getVoucherPrefix()).then(async (voucherNo:string) =>
      {
         this.headerGrid[0].fieldValue1 = voucherNo + " ";
         this.headerGrid[0].fieldValue1 = this.headerGrid[0].fieldValue1.trim();
      });
    }

    this.headerGrid[0].fieldValue2 = this.getCurrentDate(); //vdate
    this.headerGrid[1].fieldValue2 = this.getCurrentDate(); // due date

    this.bodyGrid = [];

    for (let i =0 ; i < this.rowsInTransactionGrid;++i)
      this.bodyGrid.push({sno:i+1, account_Name: '', amount: 0,drcr: '',narration: '',rctpmt:rctpmt});

     // if(getNextVoucherNo)
      ///  this.getVoucher(false);
  }
  getAccounts(accountType:string)
  {
     this.transactionService.getAccounts(this.getVoucherPrefix(),accountType).then((accounts: CodeName[]) =>
     {
      if (accountType === "account1")
        this.account1 = accounts;
      else
         this.account2 = accounts;
     });
  }
   getVoucherList(voucherPrefix:string)
  {
     this.transactionService.getVoucherList(voucherPrefix).then((vouchers: VoucherList[]) =>
     {
         this.copyVoucherList = vouchers;
         console.log(this.copyVoucherList);
     });
  }
  async printVoucherToPDF(fileName:string) :Promise<string>
  {
     let msg:string = `Recieved  payment of ${this.bodyGrid[0].amount} from ${this.bodyGrid[0].account_Name} for the month of ${ this.headerGrid[2].fieldValue1} on ${this.headerGrid[0].fieldValue2}`;
     const doc = new jsPDF('portrait', 'pt', 'a4');
     doc.setFontSize(14);
     doc.setFont('helvetica','bold');
     let currentY:number = 10;
     doc.text('Receipt', (doc.internal.pageSize.getWidth()-20)/2, currentY);
     currentY += 30;
     doc.text(msg, 10, currentY);
     if (this.platform.is('capacitor') || this.platform.is('cordova'))
     {
        const pdfOutput = doc.output('datauristring').split(',')[1]; // Get Base64 string
        try
        {
          const result =   Filesystem.writeFile({
            path: fileName,
            data: pdfOutput,
            directory: Directory.Documents // Save to public Documents folder
          //, encoding: Encoding.Base64
          });
          const result1 =   await Filesystem.writeFile({
          path: fileName,
          data: pdfOutput,
          directory: Directory.Cache // Save to public Documents folder
          //, encoding: Encoding.Base64
        });
        // this.messageService.addMsg("saved to "+fileName + ". ");

          // Open the file using the File Opener plugin
          FileOpener.open({
            filePath: fileName,
            contentType: 'application/pdf'
          });
          this.messageService.addMsg("Prited voucher to file = "+fileName);
          return result1.uri;
        }
        catch (e)
        {
          this.messageService.addMsg("Error Saving to "+fileName + ". "+ e);
          console.error('Error saving PDF:', e);
        }
      }
      else
      {
        doc.save(fileName);
        this.messageService.addMsg("Saved voucher to "+fileName);
      }
      return "";
  }
  async getEmailAddress(accountName:string):Promise<string>
  {

      return "";
  }
  async sendMail(emailAddress:string,fileName:string,uri:string)
  {
       if (this.platform.is('capacitor') || this.platform.is('cordova'))
        this.emailService.sendEmailWithAttachment(uri,emailAddress,this.transactionTite,`${this.transactionTite}`);
      else
        this.messageService.addMsg('not yet implemented in web version.  File Name = '+fileName);
  }
   async getVoucher(print:boolean,copyVoucher:boolean)
  {
     this.prevVoucherNo = this.headerGrid[0].fieldValue1;

     let sOldVoucehrNo = this.headerGrid[0].fieldValue1;
     let voucherNo =  this.getVoucherPrefix()  +sOldVoucehrNo;

     if (copyVoucher)
        voucherNo = this.copyVoucherNo;

     let rctpmt:boolean = this.isRctPmtType();
     let returnValue = false;
     this.transactionService.getVoucherFromDatabase(voucherNo).then(async (transactions: TransactionRecord[]) =>
     {
       this.clearGrid(false);
       this.bodyGrid = [];
       if (transactions.length > 0)
       {
          this.headerGrid[0].fieldValue1 = sOldVoucehrNo;
          this.headerGrid[0].fieldValue2 = transactions[0].VoucherDate;
          this.headerGrid[1].fieldValue1 = transactions[0].Account2_Name;
          this.headerGrid[1].fieldValue2 = transactions[0].DueDate;
          this.headerGrid[2].fieldValue1 = transactions[0].Narration;
          this.headerGrid[2].fieldValue2 = transactions[0].ChequeNo;
          this.resetChequeNoField();
       }
       for (let i =0 ; i < transactions.length;++i)
       {
           this.bodyGrid.push({sno:i+1, account_Name:transactions[i].Account1_Name, amount: transactions[i].Amount,drcr: transactions[i].TRType,narration: transactions[i].LNarration,rctpmt:rctpmt});
       }
       for (let i =transactions.length ; i < this.rowsInTransactionGrid;++i)
       {
          this.bodyGrid.push({sno:i+1, account_Name: '', amount: 0,drcr: '',narration: '',rctpmt:rctpmt});
       }
       if(print)
       {
        let fileName = CommonFileFunction.getFileName("Invoice_"+this.transactionType.toString()+"_");
        let uri =  await this.printVoucherToPDF(fileName);
        let emailAddress = "";
        this.accountsService.getAccountsFromSQLServerWithFetch("Name",transactions[0].Account1_Name,false).then((accounts: Account[]) =>
        {
            if (accounts.length > 0 )
            {
                emailAddress = accounts[0].Email;
                console.log ( "email = " + emailAddress +" add");
            }
            console.log("sendig mail."+ emailAddress+" add2");
            this.sendMail(emailAddress,fileName,uri);

        }).catch((errorReason) =>
          {
            // This block runs ONLY when the promise is rejected
            console.error("CAUGHT ERROR:", errorReason.message); // Output: CAUGHT ERROR: Connection failed: Server offline or invalid credentials.
             this.sendMail("",fileName,uri);
        });
       }
    }
  ).catch((errorReason) =>
          {
            // This block runs ONLY when the promise is rejected
            console.error("CAUGHT ger vouchjer ERROR:", errorReason.message); // Output: CAUGHT ERROR: Connection failed: Server offline or invalid credentials.
            this.messageService.addMsg(`Get voucher(${voucherNo}) failed .`+errorReason.message)
        });;
  }
   printVoucher()
  {
    this.getVoucher(true,false);
    //this.printVoucherToPDF();
  }
  IsBankAccount(account2_Name:string):boolean
  {

    if(this.account2.find(account =>(account.Name === account2_Name && account.AcType === "Bank")))
    {
      return true;
    }
    return false;
  }
  validateVoucher(voucherNo:string,voucherDate:string,dueDate:string,account2_Name:string,chequeNo:string,rcpmt:boolean,errMsg:ErrorMsg):boolean
  {
    if (voucherNo === "")
    {
        errMsg.SetError(enumError.EMPTYVOUCHERNO,enumErrorText.EMPTYVOUCHERNO);
        return false;
    }
    if (rcpmt)
    {
      if (account2_Name === "")
      {
         errMsg.SetError(enumError.EMPTYPAYMENTMODE,enumErrorText.EMPTYPAYMENTMODE);
          return false;
      }
      if ((this.IsBankAccount(account2_Name)) && (chequeNo === ""))
      {
         errMsg.SetError(enumError.CHEQUENOEMPTY,enumErrorText.CHEQUENOEMPTY);
         return false;
      }
    }
    if (voucherDate === "")
    {
        errMsg.SetError(enumError.INVALIDVOUCHERDATE,enumErrorText.INVALIDVOUCHERDATE);
        return false;
    }

    if (dueDate === "")
    {
        errMsg.SetError(enumError.INVALIDDUEDATE,enumErrorText.INVALIDDUEDATE);
        return false;
    }
    let voucherPrefix:string = this.getVoucherPrefix();
    if ((voucherNo.startsWith("JRV-")) ||(voucherNo.startsWith("DRV-"))||(voucherNo.startsWith("CRV-")))
    {
      let amountDr:number = 0.0;
      let amountCr:number = 0.0;
        for (let i = 0 ; i  < this.bodyGrid.length;++i)
        {
          if (this.bodyGrid[i].account_Name === "")
            continue;
          if (this.bodyGrid[i].drcr.toLowerCase() === "cr")
            amountCr += Number(this.bodyGrid[i].amount);
          else
            amountDr += Number(this.bodyGrid[i].amount);
        }
        if (amountDr != amountCr)
        {
           errMsg.SetError(enumError.DEBITSCREDITSNOTEQUAL,enumErrorText.DEBITSCREDITSNOTEQUAL);
           errMsg.errMsg.replace("${DEBITAMOUNT}",amountDr.toString());
           errMsg.errMsg.replace("${CREDITAMOUNT}",amountCr.toString());
          return false;
        }
    }
    return true;
  }
  getDataFromGrid(errMsg:ErrorMsg):TransactionRecord[]
  {
     if (this.headerGrid[0].fieldValue1  === "")
     {
        errMsg.SetError(enumError.EMPTYVOUCHERNO,enumErrorText.EMPTYVOUCHERNO);
        return [];
    }
    let voucherNo =  this.getVoucherPrefix()+this.headerGrid[0].fieldValue1.trim();
    let voucherDate = this.ConvertDateToYYYYMMDdFormat(this.headerGrid[0].fieldValue2,errMsg);

    if (errMsg.Id !== enumError.VALIDVALUE)
    {
        if (errMsg.Id === enumError.EMPTYDATE)
            errMsg.SetError(enumError.EMPTYVOUCHERDATE,enumErrorText.EMPTYVOUCHERDATE);
        else
          errMsg.SetError(enumError.INVALIDVOUCHERDATE,enumErrorText.INVALIDVOUCHERDATE);
        return [];
    }
    let account2_Name = this.headerGrid[1].fieldValue1.trim();
    let dueDate = this.ConvertDateToYYYYMMDdFormat(this.headerGrid[1].fieldValue2,errMsg);
    if (errMsg.Id !== enumError.VALIDVALUE)
    {
        if (errMsg.Id === enumError.EMPTYDATE)
             errMsg.SetError(enumError.EMPTYDUDEDATE,enumErrorText.EMPTYDUDEDATE);
        else
             errMsg.SetError(enumError.INVALIDDUEDATE,enumErrorText.INVALIDDUEDATE);
        return [];
    }
    let narration = this.headerGrid[2].fieldValue1.trim();
    let chequeNo = this.headerGrid[2].fieldValue2.trim();

     if(!this.validateVoucher(voucherNo,voucherDate,dueDate,account2_Name,chequeNo,this.isRctPmtType(),errMsg))
     {
         return [];
     }
     let transactions:TransactionRecord[] = [];
     for (let i = 0 ; i  < this.bodyGrid.length;++i)
     {
          this.bodyGrid[i].account_Name = this.bodyGrid[i].account_Name.trim();
           if (this.bodyGrid[i].account_Name === "")
              continue;
            let trasaction:TransactionRecord =
            {
              VoucherNo:voucherNo,
              VoucherDate: voucherDate,

              Account2_Name: account2_Name,
              DueDate:dueDate,

              Narration:narration,
              ChequeNo:chequeNo,

              SNo: i+1,
              Account1_Name: this.bodyGrid[i].account_Name,
              Amount: this.bodyGrid[i].amount,
              TRType: this.bodyGrid[i].drcr.trim(),
              LNarration: this.bodyGrid[i].narration.trim(),
          };
          transactions.push(trasaction);
    }
     return transactions;
  }
  addVoucher():boolean
  {
    let errMsg:ErrorMsg  = new ErrorMsg();

    let trasactions:TransactionRecord[] = this.getDataFromGrid(errMsg);
    if (errMsg.Id !==  enumError.VALIDVALUE)
    {
       //con sole.log(errMsg.errMsg);
       this.messageService.add(errMsg.errMsg,{Id:errMsg.Id,Msg:errMsg.errMsg});
       return false;
    }
    if (trasactions.length <= 0)
    {
      //con sole.log(`cant save blank data.`)
      errMsg.SetError(enumError.BLANKDATA,enumErrorText.BLANKDATA);
      this.messageService.add(errMsg.errMsg,{Id:errMsg.Id,Msg:errMsg.errMsg});
      return false;
    }
    this.transactionService.saveVoucherToDatabase(trasactions,false).then((errMsg:ErrorMsg) =>
    {
        if (errMsg.Id !== -155)
        {
            this.clearGrid(true);
            this.prevVoucherNo = "";
            return true;
        }
         return false;
    } );
    return true;
  }
  editVoucher()
  {
    let errMsg:ErrorMsg  = new ErrorMsg();
    let trasactions:TransactionRecord[] = this.getDataFromGrid(errMsg);
    if (errMsg.Id !== enumError.VALIDVALUE)
    {
       //con sole.log(errMsg.errMsg);
       this.messageService.add(errMsg.errMsg,{Id:errMsg.Id,Msg:errMsg.errMsg});
       return false;
    }
    if (trasactions.length <= 0)
    {
      errMsg.SetError(enumError.BLANKDATA,enumErrorText.BLANKDATA);
      this.messageService.add(errMsg.errMsg,{Id:errMsg.Id,Msg:errMsg.errMsg});
      return false;
    }
    this.transactionService.saveVoucherToDatabase(trasactions,true).then((errMsg:ErrorMsg) =>
    {
        if (errMsg.Id !== -155)
        {
           this.clearGrid(true);
           this.prevVoucherNo = "";
           return true;
        }
        return false;

    } );
    return true;
  }
  deleteVoucher()
  {
    let errMsg:ErrorMsg  = new ErrorMsg();
    if (this.headerGrid[0].fieldValue1  === "")
    {
       errMsg.SetError(enumError.EMPTYVOUCHERNO,enumErrorText.EMPTYVOUCHERNO);
       return;
    }
    if (errMsg.Id !== enumError.VALIDVALUE)
    {
     /// con sole.log(errMsg.errMsg);
      this.messageService.add(errMsg.errMsg,{Id:errMsg.Id,Msg:errMsg.errMsg});
      return ;
    }
    let voucherNo =  this.getVoucherPrefix()+this.headerGrid[0].fieldValue1;
    this.transactionService.deleteVoucherFromDatabase(voucherNo).then((errMsg:ErrorMsg) =>
    {
       if (errMsg.Id !== -155)
        {
            this.clearGrid(true);
            this.prevVoucherNo = "";
            return;
        }
        return;
    } );

  }

CopyVoucher()
{
  this.showCopyVoucherList = true;
  this.getVoucherList(this.getVoucherPrefix());
 /// this.setTransactionType(this.TRASACTIONTYPE.COPYTRANSACTIONS,this.TRASACTIONTITLE.COPYTRANSACTIONS);
}

  //onEnter(event: KeyboardEvent, ptable: Table, rowIndex: number, colIndex: number)
resetChequeNoField()
{
  if (this.isRctPmtType())
  {
    if(this.IsBankAccount(this.headerGrid[1].fieldValue1.trim()))
      this.headerGrid[2].fieldType2 = this.GRIDFIELDTYPE.TEXT;
    else
      this.headerGrid[2].fieldType2 = this.GRIDFIELDTYPE.LABEL;
  }
}
onPaymentModeSelected(event:any)
{
  this.resetChequeNoField();
}
 onEnter(event: KeyboardEvent, ptable: Table, rowIndex: number, colIndex: number) {
    event.preventDefault();


  }
   onEditComplete(event: any)
   {
    // The event object typically includes:
    // event.data: The row data object (already updated in the table model)
    // event.field: The name of the field that was edited
    // event.index: The row index (may be undefined in some versions/scenarios)
    if (!event.field)
    {
     /// console.log("event not defined ");
      return;
    }

    ///console.log('Edit complete:', event,this.headerGrid[0].fieldValue1);
    if (event.field === "Voucher No")
    {
      console.log("on complete voucher no");
      if (this.prevVoucherNo !== this.headerGrid[0].fieldValue1)
      {
          this.getVoucher(false,false);
      }
    }

   /* console.log('Edit complete:', event,this.headerGrid[0].fieldValue1);

    const editedRowData:headerGridType = event.data;
    const editedField: string = event.field;
    const newValue = editedRowData[editedField as keyof headerGridType];

    console.log(`Field Name'${editedField}' updated to: ${newValue}`);

    // Here you would typically call a service to save the data to your backend
    // this.productService.updateProduct(editedRowData).subscribe();*/
  }
copyVocherNoChange()
{
  console.log(this.copyVoucherNo);
  this.showCopyVoucherList = false;
  this.copyVoucherList = [];
  if (this.copyVoucherNo !== "")
  {
    this.getVoucher(false,true);
  }
  this.copyVoucherNo = "";
  ///this.setTransactionType(this.oldTrType,this.oldtrTitle);
}
    /*this.tableData = [
      {
        firstname: "David",
        lastname: "ace",
        age: "40",
      },
      {
        firstname: "AJne",
        lastname: "west",
        age: "40",
      },
      {
        firstname: "Mak",
        lastname: "Lame",
        age: "40",
      },
      {
        firstname: "Peter",
        lastname: "raw",
        age: "40",
      },
      {
        firstname: "Kane",
        lastname: "James",
        age: "40",
      },
      {
        firstname: "Peter",
        lastname: "raw",
        age: "40",
      },
      {
        firstname: "Kane",
        lastname: "James",
        age: "40",
      },
      {
        firstname: "Peter",
        lastname: "raw",
        age: "40",
      },
      {
        firstname: "Kane",
        lastname: "James",
        age: "40",
      },
      {
        firstname: "Peter",
        lastname: "raw",
        age: "40",
      },
      {
        firstname: "Kane",
        lastname: "James",
        age: "40",
      },
      {
        firstname: "Peter",
        lastname: "raw",
        age: "40",
      },
      {
        firstname: "Kane",
        lastname: "James",
        age: "40",
      },
    ];*/
}
