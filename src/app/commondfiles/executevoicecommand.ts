class ReportStruct
{
  name:string = "";
  command:string = "";
};
export class executeReportParam
{
  validReport:boolean = true;
  response:string = "";
};

export class reportInfo
{
  reports:ReportStruct[]= [{name:"general ledger",command:"GL"},
                           {name:"trial balance",command:"TB"},
                           {name:"trading account",command:"TA"},
                           {name:"stock ledger",command:"SL"},
                           {name:"stock movement",command:"SM"}];
  keywords:string[] = [" from "," to "," for "];
  reportName:string = "";
  command:string = "";
  fromDate:string= "";
  toDate:string= "";
  customerName:string = "";
  executeReportParam:executeReportParam = new executeReportParam;
  reset():void
  {
    this.reportName = "";
    this.command = "";
    this.fromDate= "";
    this.toDate= "";
    this.customerName = "";
    this.executeReportParam.response = "";
    this.executeReportParam.validReport = false;
  }
  IsvalidDate(date:string):boolean
  {
    return true;
  }
  extractreportname(text:string ):ReportStruct
  {
    let keyword:string = "generate ";
    if (text.indexOf(keyword) != 0)
      return {name:"",command:""};
    for (let i = 0; i < this.reports.length;++i)
    {
      if (text.indexOf(this.reports[i].name) >= 0)
        return {name:this.reports[i].name,command:this.reports[i].command};
    }
    return {name:"",command:""};
  }
  getNextTokenIndex(text:string,keyword:string,startIndex:number):number
  {
    let index = -1;
    for (let i = 0; i < this.keywords.length;++i)
    {
        if (this.keywords[i].trim() == keyword.trim())
        {
          console.log(`CONT KW= ${keyword}`);
           continue;
        }
        if (text.indexOf(this.keywords[i],startIndex) > 0)
        {
            let endIndex = text.indexOf(this.keywords[i],startIndex);
            console.log(`min k '${this.keywords[i]}'stind=${startIndex},endind${endIndex}`);
            if (index < 0)
                index = endIndex;
            else if (endIndex < index)
                index = endIndex;
        }
    }
    return index;
  }
  getToken(text:string,keyword:string):string
  {
   // console.log(keyword);
   if (keyword === "")
      return text;
    text = text.trim().toLocaleLowerCase();
    if (text.indexOf(keyword) < 0)
    {
      console.log("from not found ",text,keyword);
     return "";
    }
    let startIndex:number = text.indexOf(keyword) + keyword.length;
    console.log(`keyw =${keyword},stind=${startIndex}`);
    let endIndex = this.getNextTokenIndex(text,keyword,startIndex);
    if (endIndex > 0)
    {
      let foundText = text.slice(startIndex,endIndex);
      console.log("in Loop ",text,"index=",endIndex,"keyword=",keyword,"foundt=",foundText);
      return foundText;
    }
   /* for (let i = 0; i < this.keywords.length;++i)
    {
        if (this.keywords[i] == keyword)
        continue;
        if (text.indexOf(this.keywords[i]) > 0)
        {
            let endIndex = text.indexOf(this.keywords[i]);
            if (endIndex < startIndex)
               continue;
            let foundText = text.slice(startIndex,endIndex);
            console.log("in Loop ",text,"index=",endIndex,"keyword=",keyword,"foundt=",foundText);
            return foundText;
        }
    }*/
    console.log("from last ",text,keyword,text.slice(startIndex));
    return text.slice(startIndex);
  }
  extractFromDate(text:string,reportNamePresent:boolean):string
  {
    if(reportNamePresent)
      return this.getToken(text,"");

    return this.getToken(text,"from ");
  }
  extractToDate(text:string,reportNamePresent:boolean):string
  {
    if(reportNamePresent)
      return this.getToken(text,"");
    return this.getToken(text,"to ");
  }
  extractCustomerName(text:string,reportNamePresent:boolean):string
  {
    if(reportNamePresent)
      return this.getToken(text,"");
    return this.getToken(text,"for ");
  }
  setReportInfo(text:string):executeReportParam
  {
    text = text.trim().toLowerCase();
    console.log(text);
    let reportNamePresent:boolean = false;
    if (this.reportName != "")
      reportNamePresent = true;
    let report:ReportStruct = this.extractreportname(text);
    ///console.log("repor = ",reportName);
    if (report.name != "")
    {
      this.reset();
      reportNamePresent = false;
      this.reportName = report.name;
      this.command = report.command;
    }
    if (this.reportName === "")
      return   {"validReport":false,"response":"please give a valid command "};

    if (this.fromDate === "")
    {
      let fromDate:string = this.extractFromDate(text,reportNamePresent);
      if (this.IsvalidDate(fromDate))
      {
        this.fromDate = fromDate;
        if (reportNamePresent)
        {
          text = "";
        }
      }
    }
    if (this.toDate === "")
    {
      let toDate:string = this.extractToDate(text,reportNamePresent);
      if (this.IsvalidDate(toDate))
      {
        this.toDate = toDate;
        if (reportNamePresent)
        {
          text = "";
        }
      }
    }
    if (this.customerName === "")
    {
      let customerName:string = this.extractCustomerName(text,reportNamePresent);
      if (customerName != "")
      {
        this.customerName = customerName;
        if (reportNamePresent)
        {
          text = "";
        }
      }
    }
    ///let result:executeReportParam =   {"validReport":false,"response":""}
    if (this.reportName === "")
      return  {"validReport":false,"response":""};
    if (this.fromDate === "")
      return   {"validReport":false,"response":"please give from date"};

    if (this.toDate === "")
      return   {"validReport":false,"response":"please give to date"};

      if (this.customerName === "")
          return   {"validReport":false,"response":"please give customer name"};

      return   {"validReport":true,"response":""};
  }


};
