/*export interface Hero {
  id: number;
  name: string;
}*/
/*
  GIT COMMANDS
  git commit -a "msg"
  git push //to upload to git website
*/
/*
      ng serve -o // to build and run on browser
      ng build --configuration production  // to build the web page application
      //to run wpa install this
       option 1)
                npm install -g http-server
       to run
                cd D:\angular\apartment_1\dist\aparmtment_1\browser
                http-server in command window

       option2)
              npm install angular-http-server -g
      to run
              cd D:\angular\apartment_1\dist\aparmtment_1\browser
              angular-http-server in command winodow  thi

      and http://192.168.2.1:3 in browser or or http://localhost:8080

      ng build
      npx cap sync or ng cap sync android
      npx cap open android /// to open the relavant android project
*/
export interface User {
  id: number
  name: string
  active: number
  /* for version 2
  email: string
  */
}
export class UserUpgradeStatements {
  userUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS users(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          active INTEGER DEFAULT 1
        );`
      ]
    },
    /* add new statements below for next database version when required*/
    /*
    {
      toVersion: 2,
      statements: [
        `ALTER TABLE users ADD COLUMN email TEXT;`,
      ]
    }
    */
  ]
}
export interface Account {
  Id: number;
  Code: string;
  Name: string;
  Tenant: string;
  Email: string;
  PhoneNo: string;
  AcType: string;
  ParentName: string;
  Address1: string;
  Address2: string;
  Address3: string;
}
export interface GeneralLedgerRecord
{
        "RowNo":number,
        "Account1_No":number,
        "Account2_No":number,
        "VoucherNo": string,
        "VoucherDate": string,
        "Amount": number,
        "Narration": string,
        "LNarration":string,
        "Account1_Name": string,
        "Account2_Name":string,
        "ChequeNo":string
  }
  export class IncExpAccountRecord
  {
        "RowNo":number = 0;
        "Account1_Type":string = "";
        "Account1_No":number = 0;
        "Account1_Code": string = "";
        "Account1_Name":string = "";
        "Amount": number = 0;
  }
  export class IncExpStatmentRecord
  {
         Account1_Name:string = "";
         expense:IncExpAccountRecord;
         income:IncExpAccountRecord;
         constructor(grp:string,exp:IncExpAccountRecord,inc:IncExpAccountRecord)
         {
            this.expense = exp;
            this.income = inc;
            this.Account1_Name = grp;
         }
  }
 export class TransactionRecord
{
      VoucherNo:string = "";
      SNo:number = 0;
      Account1_Name:string="";
      VoucherDate:string = "";
      DueDate:string = "";
      Narration:string = "";
      Account2_Name:string="";
      Amount: number = 0.0;
      TRType:string = "Dr";
      LNarration:string = "";
      ChequeNo:string = "";

      static  enumJournalAccounts = {INVALIDACCOUNT:-501,OPENINGBALANCEACCOUNT:-500,JOURNALVOUCHERACCOUN:-450,DEBITACCOUNT:-400,
        CREDITACCOUNT:-350,OPENINGSTOCKACCOUNT:-340,SHORTAGEOFSTOCKACCOUNT:-320,EXCESSOFSTOCKACCOUNT:-300,STOCKTRANSFERACCOUNT:-280};
     static  enumTransactionType = {RECEIPT:0,PAYMENT:1,JOURNALVOUCHER:2,OPENINGBALANCE:3,DEBITNOTE:4,
      CREDITNOTE:5,OPENINGSTOCK:6,SHORTAGEOFSTOCK:7,EXCESSOFSTOCK:8,STOCKTRANSFER:9};
      static  GetJournalAccountName(TransactionType:number):string
      {
        switch (TransactionType)
        {
          case this.enumTransactionType.OPENINGBALANCE:
            return "Op. Account";
          case this.enumTransactionType.JOURNALVOUCHER:
            return "JV Account";
          case this.enumTransactionType.DEBITNOTE:
            return "Db. Note";
          case this.enumTransactionType.CREDITNOTE:
            return  "Cr. Note";
          case this.enumTransactionType.OPENINGSTOCK:
            return  "Op. Stock";
          case this.enumTransactionType.SHORTAGEOFSTOCK:
            return  "Shortage Of Stock";
          case this.enumTransactionType.EXCESSOFSTOCK:
            return  "Excess Of Stock";
          case this.enumTransactionType.STOCKTRANSFER:
            return  "Stock Transfer Account";
          default:
            return "";
        }
      return "";
    }
  }
export class CodeName
{
  Code:string = "";
  Name:string = "";
  AcType:string = "";
}
export class VoucherList
{
  VoucherNo:string = "";
};
export class  normalizedJV
{
  debitCount:number=0;
  creditCount:number= 0;
  debitAccountName:string = "";
  creditAccountName:string ="";
};
export const reportTypesInt = {GENERALLEDGER:0,TRIALBALANCE:1,INCOMEEXPENSESTATEMENT:3};
export const enumError = {EMPTYVOUCHERNO:-5000,EMPTYPAYMENTMODE:-4900,CHEQUENOEMPTY:-4800,
                          INVALIDVOUCHERDATE:-4700,INVALIDDUEDATE:-4600,
                          DEBITSCREDITSNOTEQUAL:-4500,EMPTYDATE:-4400,INVALIDDATE:-4300,
                          EMPTYVOUCHERDATE:-4200,EMPTYDUDEDATE:-4100,BLANKDATA:-4000,EMPTYFROMDATE:-3900,EMPTYTODATE:-3800,
                          INVALIDFROMDATE:-3700,INVALIDTODATE:-3600,
                          GENERALEROR:-155,VALIDVALUE:0};

export const enumErrorText = {EMPTYVOUCHERNO:"Voucher No  blank.",EMPTYPAYMENTMODE:"Payment mode blank.",
                             CHEQUENOEMPTY:"Cheque No blank.",INVALIDVOUCHERDATE:"Invalid Voucher Date.",
                             INVALIDDUEDATE:"Invalid Due Date.",
                             DEBITSCREDITSNOTEQUAL:"Debit Amount(${DEBITAMOUNT}) Not equal to Credit Amount(${CREDITAMOUNT})",
                             EMPTYDATE:"Date Empty.",
                             INVALIDDATE:"Invalid Date.",
                             EMPTYVOUCHERDATE:"Voucher Date blank.",EMPTYDUDEDATE:"Due Date blank.",BLANKDATA:"Cant save blank data.",
                             EMPTYFROMDATE:"Empty From Date.",EMPTYTODATE:"Empty to Date.", INVALIDFROMDATE:"Invalid From Date.",
                             INVALIDTODATE:"Invalid to date.",
                             GENERALEROR:"General Error.",

                            VALIDVALUE:""};

export class dateFunctions
{
  static ConvertDateToYYYYMMDdFormat(date:string,errMsg:ErrorMsg):string
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
}
export class ErrorMsg
{

   SetError(Id: number, errMsg: string)
   {
     this.Id = Id;
     this.errMsg = errMsg;
   }
   constructor()
   {
       this.Id = enumError.VALIDVALUE;
       this.errMsg  = enumErrorText.VALIDVALUE;
   }
  Id: number;
  errMsg:string;
};
export class CommonFileFunction
{
    static getFileName(fileName:string):string
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
    }
}
export class CommonCurrencyFunctions
{
  static convertNumberToString(amount:number,noOfDecimals:number):string
  {

      const options = {
      minimumFractionDigits:noOfDecimals,
      maximumFractionDigits:noOfDecimals
    };
   const formatter = new Intl.NumberFormat('en-IN', options);
    return formatter.format(amount);
  }
}
/*export class ItemFlatNode {
  name: string;
  level: number;
  expandable: boolean;
  value: string; // Additional property for multiple values
   constructor(name: string, level: number,expandable:boolean,value:string) {
    this.name = name;
    this.level = level;
     this.expandable = expandable;
      this.value = value;
   }

}*/

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
/*export interface ItemNode {
  name: string;
  children?: ItemNode[];
  value: string; // Additional property
}*/

/*export const TREE_DATA: ItemNode[] = [
  {
    name: 'Fruit',
    value: 'fruit-group',
    children: [
      { name: 'Apple', value: 'apple' },
      { name: 'Banana', value: 'banana' },
      { name: 'Orange', value: 'orange' },
    ],
  },
  {
    name: 'Vegetables',
    value: 'vegetable-group',
    children: [
      {
        name: 'Green',
        value: 'green-group',
        children: [{ name: 'Broccoli', value: 'broccoli' }, { name: 'Brussels sprouts', value: 'brussels_sprouts' }],
      },
      {
        name: 'Orange',
        value: 'orange-group',
        children: [{ name: 'Pumpkins', value: 'pumpkins' }, { name: 'Carrots', value: 'carrots' }],
      },
    ],
  },
];*/
