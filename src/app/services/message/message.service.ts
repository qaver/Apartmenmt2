import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];
  voiceMessages: string[] = [];
  msg= { Id: 0, Msg: ''};
  add(message: string,msg: {Id:number; Msg: string})
   {
     this.messages = [];
    this.messages.push(message);
    this.msg = msg;
  }
  addMsg(msg:string)
  {
     this.add(msg,{Id:-155,Msg:msg})
  }
  addVoiceMessage(message:string)
  {
    //this.voiceMessages = [];
    this.voiceMessages.push(message);
  }

  clear()
  {
    this.messages = [];
    this.voiceMessages = [];
    this.msg={ Id: 0, Msg: ''};

  }
}
