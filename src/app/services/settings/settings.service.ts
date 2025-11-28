import { Injectable } from '@angular/core';
import {settings} from '../../commondfiles/settings'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
   /* count:number = 0;
    curMsg:string = "";
  constructor() {
  }
  getmessage():string{return this.curMsg};
  getCount():number{ return this.count};
  incrementCounter():void
  {
    this.count++;
  }
   setMessage(msg:string):void
  {
    console.log(msg);
    this.curMsg = msg;
  }*/
  settings1!:settings;
  constructor() {
    this.settings1= new settings();
  }
  ChangeSettings(message1:string,count1:number):void
  {
    this.setMessage(message1);
    this.setCount(count1);
  }
  incrementCounter():void
  {
    this.setCount(this.getCount()+1);
  }
  getmessage():string
  {
    return this.settings1.getMessage();
  }
  getCount():number
  {
    return this.settings1.getCount();
  }
  setCount(count:number):void
  {
    this.settings1.setCount(count);
  }
  setMessage(msg:string):void
  {
    this.settings1.curMsg = msg;
  }
  clear():void
  {
    this.settings1.clear();
  }
}
