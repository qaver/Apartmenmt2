import { VoiceRecogitionService } from './../../services/voice-recognition/voice-recogition.service';
import { globalSettings } from './../../commondfiles/settings';

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, DOCUMENT, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
///import { ReportServiceService, Car } from '../../services/reportservice/report-service.service';
import { Account, CodeName, dateFunctions, enumError, enumErrorText, ErrorMsg, GeneralLedgerRecord,CommonFileFunction, CommonCurrencyFunctions } from '../../commondfiles/commondef';
import { ManageAccountsService } from '../../services/ManageAccountsService/manageaccounts.service';

import { ExportCSVOptions, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
//import { Ripple } from 'primeng/ripple';
//import { Tag } from 'primeng/tag';
import { PrimeNG } from 'primeng/config';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ManageTransactionService } from '../../services/ManageTransactionService/manage-transaction-service';
import { MessageService } from '../../services/message/message.service';
import { GlobalsettingsService } from '../../services/globalsettings/globalsettings.service';
import { Table } from 'primeng/table'; // Import the PrimeNG Table class
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Platform } from '@ionic/angular';
import { MessagesComponent } from "../messages/messages.component"; // Requires Ionic installation
import autoTable from 'jspdf-autotable'; // Import autoTable as a function
import { EmailService } from '../../services/emailservice/emailservice.service';



/*interface CompanyProfile {
    name: String;
    sector: String;
    thisYearSales: String;
    lastYearSales: String;
    thisYearGrowth: String;
    lastYearGrowth: String;
}*/

@Component({
  standalone: true,
  selector: 'app-report',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DatePickerModule, MessagesComponent],
  providers: [

  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent  implements AfterViewInit
{
    first = 0;
    rows = 10;
     next() {
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = this.first - this.rows;
    }

    reset() {
        this.first = 0;
    }

    pageChange(event: { first: number; rows: number; }) {
        this.first = event.first;
        this.rows = event.rows;
    }

    isLastPage(): boolean {
        return this.generalLegerRecords ? this.first + this.rows >= this.generalLegerRecords.length : true;
    }

    isFirstPage(): boolean {
        return this.generalLegerRecords ? this.first === 0 : true;
    }
    OpeningRow(record:GeneralLedgerRecord)
    {
      if (record.Account2_No === -500)
         return { fontWeight: 'bold', fontStyle: 'italic',color:"red"};
      else
        return  {color:"black"};
    }
    GetVoucherNo(record:GeneralLedgerRecord)
    {
        if (record.Account2_No === -500)
          return "";
        return record.VoucherNo;
    }
     GetVoucherDate(record:GeneralLedgerRecord)
    {
        if (record.Account2_No === -500)
          return "";
        return record.VoucherDate;
    }
    GetAccount2Name(record:GeneralLedgerRecord)
    {
        if (record.Account2_No === -500)
          return "Op. Balance";
        return record.Account2_Name;
    }
    emailData = {
    to: 'xyz@hotmail.com',
    subject: 'General ledger ',
    body: 'General ledger for one year'
  };
   no_of_decimals = 2;
   firstReportRowNo:number = -100;
   mobileApp = false;
   isLoading = true;
   ///@ViewChild('printContent') printContentRef!: ElementRef;
   @ViewChild('printContentGrid') reportGrid!: Table;
   @ViewChild('printContent', { static: false }) printContent!: ElementRef;


   isScrollable: boolean = true;
   scrollH: string = "70vh"; // The original scroll height
  ngAfterViewInit() {
    // You can access this.printContentRef.nativeElement here
     this.isLoading = false;

    // Manually run change detection
    this.cdr.detectChanges();

  }

 /*companyProfiles: CompanyProfile[] = [];
  customers: any[] = [
      { name: 'Amy Lee', country: { name: 'USA' }, company: 'Acme Corp' },
      { name: 'James Smith', country: { name: 'USA' }, company: 'Globex Inc' },
      { name: 'Anna Parker', country: { name: 'Canada' }, company: 'Maple Leaf Ltd' },
      { name: 'Peter Jones', country: { name: 'USA' }, company: 'Acme Corp' },
      { name: 'Maria Garcia', country: { name: 'Spain' }, company: 'Iberia S.A.' },
      { name: 'John Doe', country: { name: 'Canada' }, company: 'Maple Leaf Ltd' },
      { name: 'Susan White', country: { name: 'USA' }, company: 'Globex Inc' },
    ];
  groupedCustomers: any[] = [];
*/
  reportTypes:string[] = ["General Ledger","Trial Balance"];
  reportType:string = this.reportTypes[0];

  groupNames:string[] = ["All"];
  groupName:string = "All";

  accountNames:CodeName[] = [];
  accountName:string = "All";
  //datePipe = new DatePipe('en-US');

  public fromDate:string = "01/01/2025"
  public toDate:string = "31/12/2025";

  public dateMin:Date  = new Date(2025, 1, 1);
  //expandedRowGroups: any[] = [];
  //public rowData: Car[] = [];

  public accounts: Account[] = [];
 // public generalLegerRecords: GeneralLedgerRecord[] = [];

  public generalLegerRecords: GeneralLedgerRecord[] = [];
  public runningTotal = 0.0;
  public groupDr= 0.0
  public groupCr= 0.0;
  public groupBalance = 0.0;
  public groupBalancetext = "0.0"

  public currentDr = 0.0;
  public currentCr = 0.0;
  public reportTotalDr= 0.0
  public reportTotalCr= 0.0;
  public reportTotalBalance = 0.0;
  public reportTotalBalanceText = "0.0"

  public reportFinished = false;
  public colsGeneralLedger: any[] = [
    {
      field: 'Account1_Name',headerText:"Voucher No",hide:false},
    { field: 'VoucherNo',headerText:"Voucher No",hide:false },
    { field: 'VoucherDate',headerText:"VoucherDate",hide:false},
    { field: 'Account2_Name',headerText:"Particulars",hide:false },
    { field: "ChequeNo",headerText:"ChequeNo",hide:false },
    { field: 'Narration',headerText:"Narration" ,hide:false},
    { field: 'LNarration' ,headerText:"LNarration",hide:false},
    { field: 'AmountDr',headerText:"Debit",hide:false },
    { field: 'AmountCr',headerText:"Credit",hide:false },
    { field: 'Balance',headerText:"Balance",hide:false },
    { field: 'Type',headerText:"Type",hide:true},
    { field: 'Parent',headerText:"Parent",hide:true},
    { field: '"Account1_No',headerText:"account1_no",hide:true},
    { field: '"Account2_No',headerText:"account2 no",hide:true},
  ];
  convertNumberToString(amount:number):string
  {
    return CommonCurrencyFunctions.convertNumberToString(amount,this.no_of_decimals);
  }
  updateRunningTotalOld(amount:number,name: string)
  {
    ///console.log("update running total for ",name);
    if (this.reportFinished)
      return;
     this.runningTotal += amount;
     if (amount >=0.0)
        this.currentDr += amount;
      else
        this.currentCr -= amount;

  }
   updateRunningTotal(rowNo:number,amount:number,name: string)
  {

    if (rowNo === this.firstReportRowNo)
    {
        this.resetReportTotals();
    }
     /*if (rowNo <= 1)
    {
        this.resetReportTotals();
       if (this.generalLegerRecords.length > 0)
        {
          if (this.generalLegerRecords[this.generalLegerRecords.length-1].RowNo < 0)
          {
            this.generalLegerRecords.pop();
            //console.log("Poped");
          }
        }
    }*/

    if (this.reportFinished)
      return;
     this.runningTotal += amount;
    /// console.log("running tot = ",this.runningTotal," row no = ",rowNo);
     if (amount >=0.0)
     {
        this.currentDr += amount;
        this.groupDr += amount;
        this.reportTotalDr += amount;
     }
      else
      {
        this.currentCr -= amount;
        this.groupCr -= amount;
        this.reportTotalCr -= amount;
      }
      this.groupBalance = this.currentDr-this.currentCr;
      if (this.groupBalance > 0.0)
          this.groupBalancetext =  this.convertNumberToString(this.groupBalance) +'Dr';
        else if  (this.groupBalance === 0.0)
            this.groupBalancetext =  this.convertNumberToString(0.0);
        else
          this.groupBalancetext =  this.convertNumberToString(-this.groupBalance)+"Cr ";

        this.reportTotalBalance = this.reportTotalDr-this.reportTotalCr;
        if (this.reportTotalBalance > 0.0)
            this.reportTotalBalanceText =  this.convertNumberToString(this.reportTotalBalance)+'Dr';
        else if  (this.reportTotalBalance === 0.0)
            this.reportTotalBalanceText = this.convertNumberToString(0.0);
        else
          this.reportTotalBalanceText =  this.convertNumberToString(-this.reportTotalBalance)+"Cr"

         ///console.log("update running total for ",name, " row = ",rowNo , "totals/", this.reportTotalDr, "/", this.reportTotalCr );
         /* if (this.generalLegerRecords.length > 0)
         {
           let r = this.generalLegerRecords[this.generalLegerRecords.length-1];
         if((rowNo > 0 ) && (rowNo === r.RowNo)) //last row
          {
             this.generalLegerRecords.push({
               "RowNo": -111,
               Account1_No: 0,
               Account2_No: 0,
               VoucherNo: '',
               VoucherDate: '',
               Amount: 0,
               Narration: '',
               LNarration: '',
               Account1_Name: '',
               Account2_Name: '',
               ChequeNo: ''
             });
            ////console.log(" pushed last row = " ,rowNo);

          }
        }*/

  }
  resetReportTotals()
  {
      this.runningTotal = 0.0
      this.reportTotalDr = 0.0;
      this.reportTotalCr = 0.0;
      this.reportTotalBalance = 0.0

      this.currentDr = 0.0;
      this.currentCr = 0.0;
     //console.log("reset report total");
  }
  calculateCustomerTotalDr(name: string)
   {
    ///console.log("update group total for ",name);
        //this.groupDr = this.currentDr;
       ////// this.groupCr = this.currentCr;
        ///this.groupBalance = this.currentDr-this.currentCr;

        ///this.reportTotalDr +=  this.groupDr;
        ///this.reportTotalCr +=  this.groupCr;

        ////console.log( this.reportTotalDr , this.reportTotalCr);


       /// if (this.groupBalance > 0.0)
        ///  this.group Balancetext = this.groupBalance +"Dr";
        ///else if  (this.groupBalance === 0.0)
        ///    this.group Balancetext = "0.0";
        ///else
          ///this.group Balancetext = -this.groupBalance+"Cr ";


       /* if (this.reportTotalBalance > 0.0)
            this.report TotalBalanceText = this.reportTotalBalance +"Dr";
        else if  (this.reportTotalBalance === 0.0)
            this.report TotalBalanceText = "0.0";
        else
          this.report TotalBalanceText = -this.reportTotalBalance+"Cr"*/
         this.currentDr = 0.0;
         let  amount = this.groupDr;
         this.groupDr = 0.0;
        return  this.convertNumberToString(amount);
       ///  return this.groupDr;
       /* if (this.generalLegerRecords) {
            for (let record of this.generalLegerRecords)
               {
                if (record.Account1_Name === name)
                  {
                  if (record.Amount > 0)
                  {
                     this.groupDr += record.Amount;

                  }
                  else
                  {
                    this.groupCr -= record.Amount;
                  }
                  this.groupBalance += record.Amount;
                  if (this.groupBalance > 0.0)
                    this.group Balancetext = this.groupBalance +"Dr";
                  else if  (this.groupBalance === 0.0)
                      this.group Balancetext = "0.0";
                  else
                    this.group Balancetext = -this.groupBalance+"Cr";

                }
            }
        }*/


    }
   calculateCustomerTotalCr(name: string)
   {
         this.currentCr = 0.0;
         let  amount = this.groupCr;
         this.groupCr = 0.0;
        return  this.convertNumberToString(amount);
    }

    calculateCustomerTotalGroupBalance(name: string)
   {
         this.groupBalance = 0.0;
         let  grPBalancetext = this.groupBalancetext;
         this.groupBalancetext = "";
         this.groupCr = 0.0;
         this.runningTotal = 0.0;
         //console.log("runn2 ",this.runningTotal);
        return grPBalancetext;
    }
   /* calculateCustomerTotalcr(name: string)
   {
        let totalCr = 0;

        if (this.generalLegerRecords) {
            for (let record of this.generalLegerRecords) {
                if (record.Account1_Name === name) {
                  if (record.Amount < 0)
                    totalCr += record.Amount;
                }
            }
        }

        return totalCr;
    }*/
    /*groupData(data: any[], key: string): any[] {
    const groupedData = data.reduce((acc, current) => {
      const groupKey = current.country.name; // Use a valid nested key here
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(current);
      return acc;
    }, {});

    // Convert the grouped object back to an array
    const result = Object.keys(groupedData).map(groupKey => {
      return {
        country: { name: groupKey },
        customers: groupedData[groupKey]
      };
    });
    return result;
  }*/
   constructor(private cdr: ChangeDetectorRef,private accountsService:ManageAccountsService,private primeng: PrimeNG,private transactionService:ManageTransactionService,
    private messageService: MessageService,private globalsettingsService:GlobalsettingsService,private voiceService:VoiceRecogitionService,private emailService:EmailService,
    private platform: Platform)
   {
    this.primeng.ripple.set(true);


    ///let fromDate = this.datePipe.transform(this.fromDate, 'dd-MM-yyyy')
    /* this.companyProfiles = [
            {
                name: "Apple",
                sector: "Technology",
                thisYearSales: "$ 2,000,000,000",
                lastYearSales: "$ 1,700,000,000",
                thisYearGrowth: "21%",
                lastYearGrowth: "15%",
            },
            {
                name: "Mac Donalds",
                sector: "Food",
                thisYearSales: "$ 1,100,000,000",
                lastYearSales: "$ 800,000,000",
                thisYearGrowth: "18%",
                lastYearGrowth: "15%",
            },
            {
                name: "Google",
                sector: "Technology",
                thisYearSales: "$ 1,800,000,000",
                lastYearSales: "$ 1,500,000,000",
                thisYearGrowth: "15%",
                lastYearGrowth: "13%",
            },
            {
                name: "Domino's",
                sector: "Food",
                thisYearSales: "$ 1,000,000,000",
                lastYearSales: "$ 800,000,000",
                thisYearGrowth: "13%",
                lastYearGrowth: "14%",
            },
            {
                name: "Meta",
                sector: "Technology",
                thisYearSales: "$ 1,100,000,000",
                lastYearSales: "$ 1,200,000,000",
                thisYearGrowth: "11%",
                lastYearGrowth: "12%",
            },
            {
                name: "Snapchat",
                sector: "Technology",
                thisYearSales: "$ 1,500,000,000",
                lastYearSales: "$ 1,200,000,000",
                thisYearGrowth: "16%",
                lastYearGrowth: "14%",
            },
            {
                name: "Tesla",
                sector: "AutoMobile",
                thisYearSales: "$ 1,300,000,000",
                lastYearSales: "$ 900,000,000",
                thisYearGrowth: "23%",
                lastYearGrowth: "16%",
            },
            {
                name: "Ford",
                sector: "AutoMobile",
                thisYearSales: "$ 700,000,000",
                lastYearSales: "$ 750,000,000",
                thisYearGrowth: "14%",
                lastYearGrowth: "15%",
            },
            {
                name: "Twitter",
                sector: "Technology",
                thisYearSales: "$ 1,200,000,000",
                lastYearSales: "$ 1,200,000,000",
                thisYearGrowth: "19%",
                lastYearGrowth: "18%",
            }
        ];*/
     // this.generateGeneralLedger();
   }
   generateReport()
   {
      let errMsg:ErrorMsg  = new ErrorMsg();
      let stDate = dateFunctions.ConvertDateToYYYYMMDdFormat(this.fromDate,errMsg);
      if (errMsg.Id !== enumError.VALIDVALUE)
      {
          if (errMsg.Id === enumError.EMPTYDATE)
              errMsg.SetError(enumError.EMPTYFROMDATE,enumErrorText.EMPTYFROMDATE);
          else
            errMsg.SetError(enumError.INVALIDFROMDATE,enumErrorText.INVALIDFROMDATE);
          console.error(errMsg.errMsg);
          return;
      }
      let endDate = dateFunctions.ConvertDateToYYYYMMDdFormat(this.toDate,errMsg);
      if (errMsg.Id !== enumError.VALIDVALUE)
      {
          if (errMsg.Id === enumError.EMPTYDATE)
              errMsg.SetError(enumError.EMPTYTODATE,enumErrorText.EMPTYTODATE);
          else
            errMsg.SetError(enumError.EMPTYTODATE,enumErrorText.EMPTYTODATE);
          console.error(errMsg.errMsg);
          return;
      }
      if (this.reportType === "General Ledger")
        this.generateGeneralLedger(stDate,endDate)
   }
   ngOnInit(): void
   {

       if (this.platform.is('capacitor') || this.platform.is('cordova'))
       {
          this.mobileApp = true;
          this.scrollH = "60vh";
       }
      this.reportTypes = ["General Ledger","Trial Balance"];
      this.groupNames = ["All","General","Debtor","Creditor","Income","Expense","PettyCash","Cash","Bank"];
      this.groupName  = "All";
      this.accountNames = [{Code:"All",Name:"All",AcType:"All"}];
      this.messageService.clear();
      const now = new Date();

      // Format using built-in locale methods (user's local time zone)
      ///this.currentDateTime = now.toLocaleString();
      // Example output: "11/18/2025, 7:28:15 PM" (format varies by browser/locale)

      // For a specific format (e.g., YYYY-MM-DD HH:MM:SS) you can build the string:
       let year = now.getFullYear();
      //const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      ///const day = now.getDate().toString().padStart(2, '0');
      this.fromDate = "01/04/"+year.toString();
      year++;
      this.toDate = "31/03/"+year.toString();
   }


  generateGeneralLedger(stDate:string,endDate:string):void
  {
    if (this.globalsettingsService.getUseLocalDatabase())
    {

      this.generalLegerRecords = [
      {"RowNo":1,"Account1_No":-450,"Account2_No":16,"VoucherNo":"JRV-1","VoucherDate":"2025-09-02","Amount":600,"Narration":"","LNarration":"nn2","Account1_Name":"JV Account","Account2_Name":"Cash1","ChequeNo":""},
      {"RowNo":2,"Account1_No":-450,"Account2_No":18,"VoucherNo":"JRV-1","VoucherDate":"2025-09-02","Amount":-600,"Narration":"","LNarration":"nn1","Account1_Name":"JV Account","Account2_Name":"Flat101","ChequeNo":""},
      {"RowNo":3,"Account1_No":11,"Account2_No":16,"VoucherNo":"RCV-2","VoucherDate":"2025-09-26","Amount":33,"Narration":"","LNarration":"","Account1_Name":"Debtor1","Account2_Name":"Cash1","ChequeNo":""},
      {"RowNo":4,"Account1_No":16,"Account2_No":-450,"VoucherNo":"JRV-1","VoucherDate":"2025-09-02","Amount":-600,"Narration":"","LNarration":"nn2","Account1_Name":"Cash1","Account2_Name":"JV Account","ChequeNo":""},
      {"RowNo":5,"Account1_No":16,"Account2_No":18,"VoucherNo":"RCV-3","VoucherDate":"2025-09-03","Amount":-500,"Narration":"","LNarration":"ddf","Account1_Name":"Cash1","Account2_Name":"Flat101","ChequeNo":""},
      {"RowNo":6,"Account1_No":16,"Account2_No":11,"VoucherNo":"RCV-2","VoucherDate":"2025-09-26","Amount":-33,"Narration":"","LNarration":"","Account1_Name":"Cash1","Account2_Name":"Debtor1","ChequeNo":""},
      {"RowNo":7,"Account1_No":17,"Account2_No":18,"VoucherNo":"RCV-1","VoucherDate":"2025-09-03","Amount":-2000,"Narration":"","LNarration":"n1","Account1_Name":"Bank1","Account2_Name":"Flat101","ChequeNo":""},
      {"RowNo":8,"Account1_No":18,"Account2_No":-450,"VoucherNo":"JRV-1","VoucherDate":"2025-09-02","Amount":600,"Narration":"","LNarration":"nn1","Account1_Name":"Flat101","Account2_Name":"JV Account","ChequeNo":""},
      {"RowNo":9,"Account1_No":18,"Account2_No":17,"VoucherNo":"RCV-1","VoucherDate":"2025-09-03","Amount":2000,"Narration":"","LNarration":"n1","Account1_Name":"Flat101","Account2_Name":"Bank1","ChequeNo":"abbcd11"},
      {"RowNo":10,"Account1_No":18,"Account2_No":16,"VoucherNo":"RCV-3","VoucherDate":"2025-09-03","Amount":500,"Narration":"","LNarration":"ddf","Account1_Name":"Flat101","Account2_Name":"Cash1","ChequeNo":""}
    ];
    return;
 }
  //console.log(stDate,endDate,this.groupName,this.accountName);
      this.accountsService.getGeneralLedgerFromSQLServerWithFetch(stDate,endDate,this.groupName,this.accountName).then((generalLegerRecords: GeneralLedgerRecord[]) =>
      {
          this.generalLegerRecords = generalLegerRecords;
          this.runningTotal = 0.0
          this.reportTotalBalance = 0.0;
          this.reportTotalBalance = 0.0;
          this.reportTotalBalance = 0.0

          this.currentDr = 0.0;
          this.currentCr = 0.0;
          this.reportFinished = false;
          console.log(generalLegerRecords);
          if (generalLegerRecords.length > 0)
             this.firstReportRowNo = generalLegerRecords[0].RowNo;
      });
  }
  getAccounts()
  {

     this.accountNames = [];
    if (this.globalsettingsService.getUseLocalDatabase())
    {
       this.accountNames = [{Code:"All",Name:"All",AcType:"All"}];
       if (this.groupName == "Cash")
        this.accountNames.push({Code:"Cash1",Name:"Cash1",AcType:"Cash"});
      else if (this.groupName == "Debtor")
        this.accountNames.push({Code:"Debtor1",Name:"Debtor1",AcType:"Debtor"});
      else if (this.groupName == "Bank")
        this.accountNames.push({Code:"Bank1",Name:"Bank1",AcType:"Bank"});
       else if (this.groupName == "General")
        this.accountNames.push({Code:"General1",Name:"General1",AcType:"General"});
      else if (this.groupName == "Creditor")
        this.accountNames.push({Code:"Creditor1",Name:"Creditor1",AcType:"Creditor"});
      else if (this.groupName == "PettyCash")
        this.accountNames.push({Code:"PettyCash1",Name:"PettyCash1",AcType:"PettyCash"});
      else if (this.groupName == "Income")
        this.accountNames.push({Code:"Income1",Name:"Income1",AcType:"Income"});
      else if (this.groupName == "Expense")
        this.accountNames.push({Code:"Expense1",Name:"Expense1",AcType:"Expense"});
      return;
    }
     this.transactionService.getAccounts(this.groupName,"reportAccounts").then((accounts: CodeName[]) =>
     {
        this.accountNames = accounts;
        this.accountNames.unshift({Code:"All",Name:"All",AcType:"All"});

     });

     ///console.log(this.accountNames);
  }
  onaccountGroupSelected(event:any)
  {
    this.accountName = "All";
     this.getAccounts();
  }
  /*getFileName(fileName:string):string
  {
    const now = new Date();

    // Format using built-in locale methods (user's local time zone)
    ///this.currentDateTime = now.toLocaleString();
    // Example output: "11/18/2025, 7:28:15 PM" (format varies by browser/locale)

    // For a specific format (e.g., YYYY-MM-DD HH:MM:SS) you can build the string:
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0'); //

    return `${fileName}${year}${month}${day}${hours}${minutes}${seconds}.pdf`;
  }*/
   /*print2(): void {
    // This part isolates the HTML you want to print
    const printContents = this.printContent.nativeElement.innerHTML;

    // Create a temporary window/iframe to hold the contents
    const printWindow = window.open('', '_blank', 'height=1500,width=500');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <!-- Important: Include necessary PrimeNG styles or your global CSS -->
            <style>
             // / Add any specific print CSS here
              @media print {
                .p-paginator {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body onload="window.print();window.close()">
            ${printContents}
          </body>
        </html>`
      );
      printWindow.document.close();
    }
  }*/
  /*print(): void {
    // This part isolates the HTML you want to print
    const printContents = this.printContent.nativeElement.innerHTML;

    // Create a temporary window/iframe to hold the contents
    const printWindow = window.open('', '_blank', 'height=1500,width=500');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <!-- Important: Include necessary PrimeNG styles or your global CSS -->
            <style>
             /// / Add any specific print CSS here /
              @media print {
              ///  / Hide the paginator for printing /
                .p-paginator {
                  display: none !important;
                }
              //  / Ensure all content within the body is visible and flows naturally /
                body {
                  visibility: visible !important;
             //     / Remove any fixed height or overflow properties that might be on the body or parent divs /
                  height: auto !important;
                  overflow: visible !important;
                }
              //  / Ensure the specific content div is also fully visible /
                .print-content-wrapper {/// /* Add a class/ID to the element you are printing and target it here /
                    visibility: visible !important;
                    display: block !important;
                    position: static !important;
                   // / You might need to add specific width styles for optimal printing /
                    width: 100%;
                }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>`
      );
      printWindow.document.close();

      // Use setTimeout to ensure the content and styles have rendered before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500); // A small delay of 500ms
    }
}*/
/*async exportPdfAndSave() {
    // 1. Generate the PDF (Example using jsPDF)
    const doc = new jsPDF({ format: 'a4', unit: 'pt' });
    // Add content to the PDF
    doc.text("Hello world!", 10, 10);

    // Get the PDF as a Data URL/Base64 string
    const base64: string = doc.output('datauristring').split(',')[1];
    const fileName = `invoice_${Date.now()}.pdf`;

    // 2. Save the Base64 data to the filesystem
    // We use Directory.Documents which is a suitable shared directory
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
        recursive: true // Creates intermediate directories if needed
      });

      this.messageService.addMsg('File saved to: '+ result.uri);

      // 3. Open the file using the File Opener plugin
      // On Android, result.uri should be the correct path
      await FileOpener.open({
        filePath: result.uri,
        contentType: 'application/pdf'
      });

    } catch (error) {
      console.error('Error saving or opening file', error);
      // You may need to handle permission requests here if targeting older Android versions (<10)
      // and saving to general public storage, though Directory.Documents works for modern Android.
    }
  }*/

   /*glGroupedData = [
  {
    accountType: 'Assets',
    accounts: [
      {
        accountName: 'Cash',
        transactions: [
          { date: '2025-01-01', particulars: 'Opening Balance', debit: 1000, credit: 0, runningBalance: 1000 },
          { date: '2025-01-05', particulars: 'Paid utilities', debit: 0, credit: 150, runningBalance: 850 },
        ]
      },
      {
        accountName: 'Accounts Receivable',
        transactions: [
            { date: '2025-01-01', particulars: 'Sales Invoice 001', debit: 500, credit: 0, runningBalance: 500 },
        ]
      }
    ]
  },
  {
    accountType: 'Liabilities',
    accounts: [
       {
        accountName: 'liab 1',
        transactions: [
            { date: '2025-01-01', particulars: 'Sales Invoice 002', debit: 5030, credit: 0, runningBalance: 5030 },
        ]
      }
    ]
  }
];
*/

 /* GeneralLedgerFlatData()
  {
    const doc = new jsPDF();
    let currentY = 30;
    let runningBalance = 0;
    let currentAccountName = '';

   const exportColumns: any[] = []
  for (let i = 0; i <  this.colsGeneralLedger.length;++i)
    {
       if(this.colsGeneralLedger[i].hide)
          continue;
        exportColumns.push(this.colsGeneralLedger[i]);
    }

  doc.text('General Ledger Report (Linear Data)', 14, 20);

  // Iterate over the grouped types (Assets, Liabilities)
  Object.keys(this.generalLegerRecords).forEach(Account1_Name => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(Account1_Name, 14, currentY);
    currentY += 15;

    // Filter the original flat data for the current group type to process
    const typeRecords = this.generalLegerRecords.filter(r => r.Account1_Name === Account1_Name);

    // Pass the filtered records to autoTable
    autoTable(doc, {
      columns: exportColumns,
      //body: typeRecords,
      startY: currentY,
      margin: { left: 20, right: 14 },
      didParseCell: (data) =>
      {
        const rowData = data.row.raw as any;

        // Check for new account header and reset balance
        if (rowData.Account1_Name !== currentAccountName)
        {
            currentAccountName = rowData.Account1_Name;
            runningBalance = 0; // Reset balance for new account
            // Display header in PDF if needed, using currentY as reference
            // ... (requires manual Y tracking or another hook)
        }

        // Calculate and set the running balance
        if (data.section === 'body' && data.column.dataKey === 'balance')
        {
          runningBalance += rowData.debit - rowData.credit;
          data.cell.text = [`$${runningBalance.to Fixed(no_of_decimals)}`];
        }
      },
      didDrawCell: (data) => {
          // You can also use didDrawCell to manually add headers/footers here based on grouping logic
      }
    });

    currentY = (doc as any).lastAutoTable.finalY || currentY;
    currentY += 15; // Spacing
  });

  doc.save('general_ledger_linear_data.pdf');
}*/
 /* GeneralLedgerWithGroups()
 {
  const doc = new jsPDF();
  let currentY = 30; // Starting Y position

  const transactionCols = [
    { header: 'Date', dataKey: 'date' },
    { header: 'Particulars', dataKey: 'particulars' },
    { header: 'Debit', dataKey: 'debit' },
    { header: 'Credit', dataKey: 'credit' },
    { header: 'Balance', dataKey: 'runningBalance' }
  ];

  doc.text('General Ledger Report', 14, 20);

  this.glGroupedData.forEach(group => {
    // 1. Draw the main Account Group Header (e.g., "Assets")
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(group.accountType, 14, currentY);
    currentY += 15;

    group.accounts.forEach(accountData => {
      // 2. Draw the specific Account Header (e.g., "Cash")
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Account: ${accountData.accountName}`, 20, currentY);
      currentY += 10;

      // 3. Draw the transaction table for this account
      autoTable(doc, {
        columns: transactionCols,
        body: accountData.transactions,
        startY: currentY,
        margin: { left: 20, right: 14 }, // Indent the table slightly
        styles: { fontSize: 9 },
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      });

      // 4. Update the Y position after the table finishes
      currentY = (doc as any).lastAutoTable.finalY || currentY;

      // 5. Add account subtotal (footer for the account)
      const subtotal = accountData.transactions[accountData.transactions.length - 1].runningBalance;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      // Position total relative to the end of the table
      doc.text(`Ending Balance: $${subtotal.to Fixed(no_of_decimals)}`, doc.internal.pageSize.getWidth() - 60, currentY + 10);

      currentY += 20; // Add vertical spacing before the next account
    });

    // Add extra space after a whole group finishes
    currentY += 15;
  });

  doc.save('general_ledger_grouped.pdf');
}*/
 async exportToPdf_FromData(fileName:string) :Promise<string>
 {

    const exportColumns: any[] = []
    for (let i = 1; i <  this.colsGeneralLedger.length;++i)
    {
       if(this.colsGeneralLedger[i].hide)
          continue;
        exportColumns.push(this.colsGeneralLedger[i]);
    }
  //  console.log(exportColumns);
    // 2. Create a new jsPDF instance
    const doc = new jsPDF('portrait', 'pt', 'a4');

    // 1. Compute the new value for each item and add it to the object
    const tableBody = this.generalLegerRecords.map(record => {
      // Create a new object that includes the calculated 'totalPrice'
      return {
        ...record, // Copy existing properties
      };
    });

    let currentY = 30;
    // Helper function to group by a key
      const groupBy = (key:any) => (array:any) =>
        array.reduce((objectsByKeyValue:any, obj:any) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
          return objectsByKeyValue;
      }, {});

   const groupedByType = groupBy('Account1_Name')(this.generalLegerRecords);
      ///console.log(groupedByType);
  doc.text('General Ledger', (doc.internal.pageSize.getWidth()-20)/2, currentY);
   currentY += 20;
   let reportDr = 0.0;
   let reportCr = 0.0;
   let reportBalance = 0.0;

   Object.keys(groupedByType).forEach(Account1_Name =>
    {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(Account1_Name, (doc.internal.pageSize.getWidth()-50)/2, currentY);
      console.log(Account1_Name , " acc1 name" +this.generalLegerRecords.length) ;
      currentY += 10;
      let currentBalance = 0.0;
      let groupDr = 0.0;
      let groupCr = 0.0;
      let groupBalance = 0.0;
      let typeRecords:any[] = this.generalLegerRecords.filter(r => r.Account1_Name === Account1_Name);
      autoTable(doc, {
      head: [exportColumns.map(c => c.headerText)],
      body: typeRecords,

      columnStyles: {
      0: { cellWidth: 65, halign: 'left' },
      1: { cellWidth: 65, halign: 'left' },
      2: { cellWidth: 110, halign: 'left' },
      3: { cellWidth: 70, halign: 'left' },
      4: { cellWidth: 60, halign: 'left' },
      5: { cellWidth: 60, halign: 'left' },
      6: { cellWidth: 50, halign: 'right' },
      7: { cellWidth: 50, halign: 'right' },
      8: { cellWidth: 60, halign: 'right' }
      },
      theme: 'grid',
      startY: currentY,
      margin: { left: 1, right: 1 }, // Indent the table slightly
      styles: { fontSize: 9 ,halign: 'left'},
      headStyles: { fillColor: [24,93,150], textColor: [255, 255, 255] ,halign: 'center' },
      rowPageBreak: 'avoid', // Prevent breaking groups across pages if possible
      didParseCell: (data) =>
      {
          if (data.section === 'head')
          {
          }
          else if (data.section === 'foot')
          {
              // Style the footer totals differently
              // ...
          }
          else if (data.section === 'body')
          {
             if (typeRecords[data.row.index].Account2_No === -500)
             {
               data.cell.styles.textColor = [255, 0, 0];
               data.cell.styles.fontStyle = 'bolditalic';
             }
            ///console.log("body ",typeRecords[data.row.index]);
            if (data.column.index === 0)
            {
              if (typeRecords[data.row.index].VoucherNo !== null)
               data.cell.text = [typeRecords[data.row.index].VoucherNo];
            }
            else if (data.column.index === 1)
            {

              if (typeRecords[data.row.index].VoucherDate !== null)
                data.cell.text = [typeRecords[data.row.index].VoucherDate];
            }
            else if (data.column.index === 2)
            {
              if (typeRecords[data.row.index].Account2_Name !== null)
                data.cell.text = [typeRecords[data.row.index].Account2_Name];
            }
            else if (data.column.index === 3)
            {
              if (typeRecords[data.row.index].ChequeNo !== null)
                data.cell.text = [typeRecords[data.row.index].ChequeNo];
            }
            else if (data.column.index === 4)
            {
              if (typeRecords[data.row.index].Narration !== null)
                data.cell.text = [typeRecords[data.row.index].Narration];
            }
            else if (data.column.index === 5)
            {
              if (typeRecords[data.row.index].LNarration !== null)
                data.cell.text = [typeRecords[data.row.index].LNarration];
            }
            else if (data.column.index === 6) // debit amount
            {
               let amount:number = 0.0;
               if( typeRecords[data.row.index].Amount > 0.0)
               {
                  amount = typeRecords[data.row.index].Amount;
                  currentBalance += amount;
                  groupDr += amount;
                // Overwrite the cell's text content with the computed value
                  data.cell.text = [`${this.convertNumberToString(amount)}`];
               }
               else
               {
                  data.cell.text = [""];
               }
            }
            else if (data.column.index === 7) //credit amount
            {
               let amount:number = 0.0;
               if( typeRecords[data.row.index].Amount < 0.0)
               {
                  amount = typeRecords[data.row.index].Amount;
                  currentBalance += amount;
                  groupCr += amount;
                  amount = -amount;
                  data.cell.text = [`${this.convertNumberToString(amount)}`];
               }
               else
               {
                  data.cell.text = [""];
               }
            }
            else if (data.column.index === 8) //balance
            {
               groupBalance += currentBalance;
               if( groupBalance < 0.0)
               {
                  data.cell.text = [`${this.convertNumberToString(-groupBalance)}Cr`];
               }
               else  if( groupBalance > 0.0)
               {
                   data.cell.text = [`${this.convertNumberToString(groupBalance)}Dr`];
               }
               currentBalance  = 0.0;
            }
          }

        }
       ,
      // Hook to draw headers and footers
      didDrawCell: (data) =>
      {

        if  ((data && data.table) && (data.section === 'body'))
        {
            if (data.row.index  === typeRecords.length-1)
            {
              if (data.column.index === 5)
              {
                const targetColIndex = 5;
                const targetCell = data.row.cells[targetColIndex];
                if (targetCell)
                {
                    doc.setTextColor(255, 0, 0);
                    let totalXPos = targetCell.x; // Right edge of the column
                    const totalYPos = data.cell.y +targetCell.height +15; // Position above the current row
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    /// console.log("in footer",totalXPos,totalYPos);
                    // doc.text aligns based on the X coordinate provided and the options {align: 'right'}
                    doc.text(`Sub Total`,totalXPos,totalYPos,{ align: 'left' } );
                    totalXPos += targetCell.width;

                    let targetCell1 = data.row.cells[6];
                    totalXPos += targetCell1.x + targetCell1.width; // Right edge of the column
                    doc.text(`${this.convertNumberToString(groupDr)}`,totalXPos,totalYPos,{ align: 'right' } );
                    reportDr += groupDr;

                    targetCell1 = data.row.cells[7];
                    totalXPos += targetCell1.x + targetCell1.width; // Right edge of the column
                    if (groupCr < 0)
                      doc.text( `${this.convertNumberToString(-groupCr)}`,totalXPos,totalYPos, { align: 'right' });
                    else
                      doc.text( `${this.convertNumberToString(0.0)}`,totalXPos,totalYPos, { align: 'right' });
                    reportCr += groupCr;

                    targetCell1 = data.row.cells[8];
                    totalXPos += targetCell1.x + targetCell1.width; // Right edge of the column
                    if (groupBalance < 0)
                    {
                      doc.text(`${this.convertNumberToString(-groupBalance)}Cr`,totalXPos,totalYPos,{ align: 'right' });
                    }
                    else if (groupBalance === 0)
                    {
                      doc.text(`${this.convertNumberToString(0.0)}`,totalXPos,totalYPos,{ align: 'right' });
                    }
                    else
                       doc.text(`${this.convertNumberToString(groupBalance)}Dr`,totalXPos,totalYPos,{ align: 'right' });
                     reportBalance += groupBalance;
                  }
                  if ((this.generalLegerRecords.length > 0 ) && (typeRecords[data.row.index].RowNo == this.generalLegerRecords[this.generalLegerRecords.length-1].RowNo))
                  {
                    doc.setTextColor(255, 0, 0);
                    let totalXPos = targetCell.x ; // Right edge of the column
                    const totalYPos = data.cell.y +targetCell.height + targetCell.height +15; // Position above the current row
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    /// console.log("in footer",totalXPos,totalYPos);
                    // doc.text aligns based on the X coordinate provided and the options {align: 'right'}
                    doc.text(`Report Total`,totalXPos,totalYPos,{ align: 'left' });
                    totalXPos +=  targetCell.width;
                    let targetCell1 = data.row.cells[6];
                    totalXPos += targetCell1.x + targetCell1.width; // Right edge of the column
                    doc.text(`${this.convertNumberToString(reportDr)}`,totalXPos,totalYPos,{ align: 'right' });

                    targetCell1 = data.row.cells[7];
                    totalXPos += targetCell1.x + targetCell1.width; // Right edge of the column
                    doc.text(`${this.convertNumberToString(-reportCr)}`,totalXPos,totalYPos,{ align: 'right' } );

                    targetCell1 = data.row.cells[8];
                    totalXPos += targetCell1.x + targetCell1.width; // Right edge of the column
                    if (reportBalance < 0.0)
                    {
                      doc.text(`${this.convertNumberToString(-reportBalance)}Cr`,totalXPos,totalYPos,{ align: 'right' });
                    }
                    else if (reportBalance === 0.0)
                    {
                        doc.text(`${this.convertNumberToString(0.0)}`,totalXPos,totalYPos,{ align: 'right' });
                    }
                    else
                       doc.text(`${this.convertNumberToString(reportBalance)}Dr`,totalXPos,totalYPos,{ align: 'right' });
                  }
             }
          }

          // If it's the last row, draw the final subtotal and grand total
          if (data.row.index === this.generalLegerRecords.length - 1)
          {
              /*const finalY = (doc as any).lastAutoTable.finalY;
              doc.setFontSize(10);
              doc.text(`Sub Total for ${previousCategory}: ${subTotal}`, data.settings.margin.left + data.table.width - 70, finalY + 10);

              // Add Grand Total
              const grandTotal = this.products.reduce((sum, p) => sum + p.quantity, 0);
              doc.setFontSize(12);
              doc.text(`Grand Total: ${grandTotal}`, data.settings.margin.left + data.table.width - 70, finalY + 30);*/
          }
        }
      },

    });
    currentY = (doc as any).lastAutoTable.finalY + 30;
  });
    // Optional: Add a title


    // 4. Save the PDF
    if (this.mobileApp)
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
    }
    return "";
  }
  async exportToImageBasedPdf(fileName:string)
  {
      this.messageService.addMsg("Saving to "+fileName);
      console.log("scroll ht  = "+this.reportGrid.scrollHeight);
     // 1. TEMPORARILY DISABLE SCROLLING (Expand the table fully)
      const oldScrollH = this.scrollH ;
      const oldIsScrollable = this.isScrollable;
      this.isScrollable = false;
      this.scrollH = ""; // Remove the height constraint

      // Wait for Angular's change detection cycle to complete
      // and the DOM to update with the full table height
      await new Promise(resolve => setTimeout(resolve, 50));

      // 2. CAPTURE THE FULL HTML ELEMENT
      const inputElement = this.printContent.nativeElement;
      const originalHeight = inputElement.style.height;
      const originalOverflow = inputElement.style.overflow;

      ///const originalWidth = inputElement.style.width;

      console.log("sc widt = ",inputElement.scrollWidth);
      if (this.mobileApp)
      {
          inputElement.style.height = 'auto'; // Force height to auto-calculate all content
         // inputElement.style.width = 'auto'; // Force width to auto-calculate all content
          inputElement.style.overflow = 'visible'; // Ensure nothing is hidden
      }
      html2canvas(inputElement, {
        useCORS: true,
        scale: 2, // Improves PDF clarity
        logging: true
      }).then(canvas =>
      {
        // 3. GENERATE THE PDF
        const imgData = canvas.toDataURL('image/png');
        /*const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = canvas.height * pdfWidth / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);*/

        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        // Calculate ratio to fit the image on the PDF page
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;
        const x = (pdfWidth - width) / 2;

        // 4. Add the image to the PDF
        console.log("img wd = ",imgWidth,"ht =",imgHeight,"wdt = ",width, " ht = ",height,"pdf wd = ",pdfWidth,"ht = ",pdfHeight," ratio = ",ratio ," ");
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);

        if (this.mobileApp)
        {
          const pdfOutput = pdf.output('datauristring').split(',')[1]; // Get Base64 string
          try
          {
            const result =   Filesystem.writeFile({
              path: fileName,
              data: pdfOutput,
              directory: Directory.Documents // Save to public Documents folder
             //, encoding: Encoding.Base64
            });

           // this.messageService.addMsg("saved to "+fileName + ". ");

            // Open the file using the File Opener plugin
            FileOpener.open({
              filePath: fileName,
              contentType: 'application/pdf'
            });

          }
          catch (e)
          {
            this.messageService.addMsg("Error Saving to "+fileName + ". "+ e);
            console.error('Error saving PDF:', e);
          }
        }
        else
        {

            pdf.save(fileName);
            this.messageService.addMsg("Saved to "+fileName + ". ");
        }

      });
      if (this.mobileApp)
      {
          inputElement.style.height = originalHeight;
          inputElement.style.overflow = originalOverflow;
      }
    // 4. REVERT SCROLLING PROPERTIES (Restore the original UI)
      this.isScrollable = oldIsScrollable;
      this.scrollH = oldScrollH;
  }
  async sendMail(fileName:string,uri:string)
  {
      if (this.mobileApp)
        this.emailService.sendEmailWithAttachment(uri,this.emailData.to,this.reportType,`${this.reportType} from ${this.fromDate} to ${this.toDate}`);
      else
        this.messageService.addMsg('not yet implemented in web version.  File Name = '+fileName);
  }
  async exportPdf()
  {
      let fileName:string = CommonFileFunction.getFileName("Report_GL");
       const uri = await  this.exportToPdf_FromData(fileName);// this function uses the GL data generate the table based pdf  file .file size is small usually in KBS. but the report has to be recreated from the recordset and not html
                                          // would require different function for each report type.
      this.emailData.to = "";
      if ((this.groupName.toLocaleLowerCase() !== "all") && (this.accountName.toLocaleLowerCase() !== "all"))
      {
          this.accountsService.getAccountsFromSQLServerWithFetch("Name",this.accountName,false).then((accounts: Account[]) =>
          {
              if (accounts.length > 0 )
              {
                  this.emailData.to = accounts[0].Email;
                ///  console.log ( "email = " + this.emailData.to +" add");
              }
             /// console.log("sendig mail."+ this.emailData.to+" add2");
              this.sendMail(fileName,uri);

          });
      }
      else
      {
          //console.log("sendig mail. no mail address"+ this.emailData.to+" add3");
          this.sendMail(fileName,uri);
      }

      ///this.exportToImageBasedPdf(fileName); // this funciton creates the image from html and saves as pdf file . file size is large  and typically in MBS but works for all report types.
      return;
    }


  }
/*
m_pReportGrid->SetColumnCount(11);

	short shAccount2_NameCol = 3;
	short shGroup1ColNo =  shAccount2_NameCol;
	short shDebitCol = 7;
	short shCreditCol = 8;
	short shBalanceAmountCol = 9;

	m_pReportGrid->SetHighlightGroupPrintAtCol(shAccount2_NameCol);
	m_pReportGrid->SetItemText(0,0,CString("SNo."));
	m_pReportGrid->SetItemText(0,1,CString("VoucherNo"));
	m_pReportGrid->SetItemText(0,2,CString("VoucherDate"));
	m_pReportGrid->SetItemText(0,shAccount2_NameCol,CString("Account Name"));
	m_pReportGrid->SetItemText(0,4,CString("ChequeNo"));
	m_pReportGrid->SetItemText(0,5,CString("Narration"));
	m_pReportGrid->SetItemText(0,6,CString("LNarration"));
	m_pReportGrid->SetItemText(0,shDebitCol,CString("Debit"));
	m_pReportGrid->SetItemText(0,shCreditCol,CString("Credit"));
	m_pReportGrid->SetItemText(0,shBalanceAmountCol,CString("Balance"));

	SetHeadingRow(0);

	m_pReportGrid->SetColFormat(0,DT_RIGHT|DT_VCENTER|DT_SINGLELINE);
	m_pReportGrid->SetColFormat(shDebitCol,DT_RIGHT|DT_VCENTER|DT_SINGLELINE);
	m_pReportGrid->SetColFormat(shCreditCol,DT_RIGHT|DT_VCENTER|DT_SINGLELINE);
	m_pReportGrid->SetColFormat(shBalanceAmountCol,DT_RIGHT|DT_VCENTER|DT_SINGLELINE);



	m_Record.Add(CReportField(CString("Account1_Name"),-1,shGroup1ColNo,CReportField::STRINGFIELD,true));
	m_Record.Add(CReportField(CString("VoucherNo"),-1,1,CReportField::STRINGFIELD,false));
	m_Record.Add(CReportField(CString("VoucherDate"),-1,2,CReportField::DATEFIELD,false));
	m_Record.Add(CReportField(CString("Account2_Name"),-1,shAccount2_NameCol,CReportField::STRINGFIELD,false));
	m_Record.Add(CReportField(CString("ChequeNo"),-1,4,CReportField::STRINGFIELD,false));
	m_Record.Add(CReportField(CString("Narration"),-1,5,CReportField::STRINGFIELD,false));
	m_Record.Add(CReportField(CString("LNarration"),-1,6,CReportField::STRINGFIELD,false));
	m_Record.Add(CReportField(CString("Amount"),-1,-1,CReportField::DOUBLEFIELD,true));

  m_pReportGrid->SetColumnWidth(0,50);
	m_pReportGrid->SetColumnWidth(1,100);
	m_pReportGrid->SetColumnWidth(2,200);
	m_pReportGrid->SetColumnWidth(3,350);
	m_pReportGrid->SetColumnWidth(4,100);
	m_pReportGrid->SetColumnWidth(5,100);
	m_pReportGrid->SetColumnWidth(6,100);
*/
