import { Capacitor } from "@capacitor/core";

/*import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})*/
export class settings
{
  count:number = 0;
  curMsg:string = "";
  clear():void
  {
    this.setMessage("");
    this.setCount(0);
  }
  constructor()
  {

  }
  getCount():number{ return this.count};
  getMessage():string{return this.curMsg};
  getSettings():settings
  {
    return this;
  }
  setMessage(msg:string):void{
    this.curMsg = msg;
  }
  setCount(count1:number):void{
    this.count = count1;
  }
  setSettings(msg:string,count1:number):void{
    this.setMessage(msg);
    this.setCount(count1);

  }
  setSettings1(setting1:settings):void
  {
    this.setMessage(setting1.getMessage());
    this.setCount(setting1.getCount());

  }
};

export class globalSettings
{
  useLocalDatabase:boolean = false;
  useVoiceCommand:boolean = false;
  useFetchCommand:boolean = true;
  databaseName:string = "heroes";
  rowsInTransactionGrid = 50;
  public url:string =  "http://localhost:3000";
  clear():void
  {
    this.setUseLocalDatabase(false);
    this.setUseVoiceCommand(true);
    this.setUseFetchCommand(true);
    this.setDatabaseName("heroes");
    this.setRowsInTransactionGrid(10);
    if (Capacitor.getPlatform().toLowerCase() !== 'web')
       this.setRowsInTransactionGrid(50);

    this.setUrl("");
  }

  // check if sqlcloud is running https://ccdw2ffidk.g6.sqlite.cloud/
  constructor()
  {
       if (Capacitor.getPlatform().toLowerCase() !== 'web')
       {
          this.useVoiceCommand  = true;
          this.url = "http://183.82.96.120:5533";
          this.url = "https://apartment-qqmw.onrender.com"; // for sqllite cloud data base need to connect every 12 hours to keep it online
          this.url = "https://apartment-turso.onrender.com"; // running from either on render
          this.rowsInTransactionGrid = 10;

       }
       else
       {
         this.url = "https://apartment-turso.onrender.com"; // running from either on render
        /// this.url = "http://localhost:3000";
       }
  }
  getUseLocalDatabase():boolean{ return this.useLocalDatabase};
  getUseVoiceCommand():boolean{ return this.useVoiceCommand};
  getUseFetchCommand():boolean{ return this.useFetchCommand};
  getDatabaseName():string{return this.databaseName};
  getUrl():string{return this.url};
  getRowsInTransactionGrid():number {return this.rowsInTransactionGrid};
  getGlobalSettings():globalSettings
  {
    return this;
  }

  setDatabaseName(databaseName:string):void{
    this.databaseName = databaseName;
  }
  setUseLocalDatabase(useLocalDatabase:boolean):void{
    this.useLocalDatabase = useLocalDatabase;
  }
  setUseVoiceCommand(useVoiceCommand:boolean):void{
    this.useVoiceCommand = useVoiceCommand;
  }
  setUseFetchCommand(useFetchCommand:boolean):void{
    this.useFetchCommand = useFetchCommand;
  }
  setUrl(url:string):void{
    this.url = url;
  }
  setRowsInTransactionGrid(rows:number):void{
    this.rowsInTransactionGrid = rows;
  }

  setSettings(databaseName:string,useLocalDatabase:boolean,useVoiceCommand:boolean,useFetchCommand:boolean,url:string,rows:number):void{
    this.setUseLocalDatabase(useLocalDatabase);
    this.setDatabaseName(databaseName);
    this.setUseVoiceCommand(useVoiceCommand);
    this.setUseFetchCommand(useFetchCommand);
    this.setRowsInTransactionGrid(rows);
    this.setUrl(url);

  }
  setSettings1(glbSettings:globalSettings):void
  {
    this.setUseLocalDatabase(glbSettings.getUseLocalDatabase());
    this.setDatabaseName(glbSettings.getDatabaseName());
    this.setUseVoiceCommand(glbSettings.getUseVoiceCommand());
    this.setUseFetchCommand(glbSettings.getUseFetchCommand());
    this.setUrl(glbSettings.getUrl());
    this.setRowsInTransactionGrid(glbSettings.getRowsInTransactionGrid());
  }
};

