import { Injectable } from '@angular/core';
import { globalSettings } from '../../commondfiles/settings';

@Injectable({
  providedIn: 'root'
})
export class GlobalsettingsService {

  globalSetting!:globalSettings;
  constructor() {
    this.globalSetting= new globalSettings();
  }

  getUseLocalDatabase():boolean{ return this.globalSetting.getUseLocalDatabase()};
  getUseVoiceCommand():boolean{ return this.globalSetting.getUseVoiceCommand()};
  getUseFetchCommand():boolean{ return this.globalSetting.getUseFetchCommand()};
  getDatabaseName():string{return this.globalSetting.getDatabaseName()};
  getUrl():string{return this.globalSetting.getUrl()};
  getRowsInTransactionGrid():number{return this.globalSetting.getRowsInTransactionGrid()};
  getGlobalSettings():globalSettings
  {
    return this.globalSetting;
  }



  setDatabaseName(databaseName:string):void{
    this.globalSetting.setDatabaseName(databaseName);
  }
  setUseLocalDatabase(useLocalDatabase:boolean):void{
    this.globalSetting.setUseLocalDatabase(useLocalDatabase);
  }
  setUseVoiceCommand(useVoiceCommand:boolean):void{
    this.globalSetting.setUseVoiceCommand(useVoiceCommand);
  }
  setUseFetchCommand(useFetchCommand:boolean):void{
    this.globalSetting.setUseFetchCommand(useFetchCommand);
  }
  setUrl(url:string):void{
    this.globalSetting.setUrl(url);
  }
  setRowsInTransactionGrid(rows:number):void{
    this.globalSetting.setRowsInTransactionGrid(rows);
  }
  ChangeSettings(databaseName:string,useLocalDatabase:boolean,useVoiceCommand:boolean,useFetchCommand:boolean,url:string,rows:number):void
  {
    this.setDatabaseName(databaseName);
    this.setUseLocalDatabase(useLocalDatabase);
    this.setUseVoiceCommand(useVoiceCommand);
    this.setUseFetchCommand(useFetchCommand);
    this.setUrl(url);
    this.setRowsInTransactionGrid(rows);
  }

  clear():void
  {
    this.globalSetting.clear();
  }
}
