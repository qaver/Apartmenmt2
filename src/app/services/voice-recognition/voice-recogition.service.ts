import { globalSettings } from '../../commondfiles/settings';

import { Injectable, NgZone } from '@angular/core';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';
import { reportInfo } from '../../commondfiles/executevoicecommand';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { GlobalsettingsService } from '../globalsettings/globalsettings.service';
declare var webkitSpeechRecognition:any;
const synth = window.speechSynthesis;
let voices = [];
const voiceSelect = document.querySelector("select");
enum commandtype{LINKROUT,CHECKBOX,INPUTBOX,BUTTON};
class command
{
    id:string = "";
    path:string = "";
    type:commandtype = commandtype.LINKROUT;
    pageid:string = "";
};
async function checkAndRequestPermissions() {
  let status = await SpeechRecognition.checkPermissions();

  if (status.speechRecognition !== 'granted') {
    status = await SpeechRecognition.requestPermissions();
    if (status.speechRecognition !== 'granted') {
      console.error("Speech recognition permission not granted");
      return false;
    }
  }
  return true;
}
async function startRecognition()
{
  await SpeechRecognition.start({
    language: "en-US",
    maxResults: 1,
    prompt: "Say something",
    partialResults: true, // Listen for results as they come
    popup: false // Set popup to false on Android for better event handling
  });
}

@Injectable({
  providedIn: 'root'
})

export class VoiceRecogitionService {

  commands:command[]  =  [{id:"general ledger",path:'reports',type:commandtype.LINKROUT,pageid:"reports"},
                          {id:"report",path:'reports',type:commandtype.LINKROUT,pageid:"main"},
                          {id:"accounts",path:'accountstree',type:commandtype.LINKROUT,pageid:"main"},
                          {id:"settings",path:'globalsettings',type:commandtype.LINKROUT,pageid:"main"},
                          {id:"transactions",path:'transaction',type:commandtype.LINKROUT,pageid:"main"},
                          {id:"transaction",path:'transaction',type:commandtype.LINKROUT,pageid:"main"},
                          {id:"vouchers",path:'transaction',type:commandtype.LINKROUT,pageid:"main"},
                           {id:"voucher",path:'transaction',type:commandtype.LINKROUT,pageid:"main"},

                          {id:"use memory database",path:'UseInMemoryDatabase',type:commandtype.CHECKBOX,pageid:"globalsettings"},
                          {id:"use sql server database",path:'UseSQLServerDatabase',type:commandtype.CHECKBOX,pageid:"globalsettings"},
                          {id:"use fetch command",path:'UseFetchCommand',type:commandtype.CHECKBOX,pageid:"globalsettings"},

                          {id:"generate",path:'Generate',type:commandtype.BUTTON,pageid:"reports"},
                          {id:"add",path:'add',type:commandtype.BUTTON,pageid:"accountstree"},
                          {id:"edit",path:'edit',type:commandtype.BUTTON,pageid:"accountstree"},
                          {id:"delete",path:'delete',type:commandtype.BUTTON,pageid:"accountstree"},
                          {id:"stop listening",path:'stoplistening',type:commandtype.BUTTON,pageid:"main"},

                          {id:"receipt",path:'receipt',type:commandtype.BUTTON,pageid:"listoftransactions"},
                          {id:"payment",path:'payment',type:commandtype.BUTTON,pageid:"listoftransactions"},
                          {id:"opening balance",path:'openingvoucher',type:commandtype.BUTTON,pageid:"listoftransactions"},
                          {id:"journal voucher",path:'journalvoucher',type:commandtype.BUTTON,pageid:"listoftransactions"},
                          {id:"debit note",path:'debitnote',type:commandtype.BUTTON,pageid:"listoftransactions"},
                          {id:"credit note",path:'creditnote',type:commandtype.BUTTON,pageid:"listoftransactions"},
                          {id:"exit",path:'exit',type:commandtype.BUTTON,pageid:"transaction"},
                          {id:"get",path:'getvoucher',type:commandtype.BUTTON,pageid:"transaction"},
                          {id:"add",path:'addvoucher',type:commandtype.BUTTON,pageid:"transaction"},
                          {id:"edit",path:'editvoucher',type:commandtype.BUTTON,pageid:"transaction"},
                          {id:"delete",path:'deletevoucher',type:commandtype.BUTTON,pageid:"transaction"},

                          {id:"from",path:'from-date',type:commandtype.INPUTBOX,pageid:"reports"},
                          {id:"to",path:'to-date',type:commandtype.INPUTBOX,pageid:"reports"},

                          {id:"group",path:'accountGroup',type:commandtype.INPUTBOX,pageid:"reports"},
                          {id:"account",path:'accountName',type:commandtype.INPUTBOX,pageid:"reports"},
                          {id:"type",path:'reportType',type:commandtype.INPUTBOX,pageid:"reports"},

                ];
  voiceRecorgintionRunning:boolean = false;
  private isListeningContinuously = false;
  private finalTranscript: string = '';

  results:any;
  vSearch:any = null;
  currentReport:reportInfo = new reportInfo;
  async startListeningContinuously()
  {
    this.isListeningContinuously = true;
    this.finalTranscript = ''; // Clear previous transcript on start

    // Ensure permissions are handled before starting (omitted for brevity, see previous answer)

    const available = await SpeechRecognition.available();
    if (!available.available)
    {
        console.error("Speech recognition not available on this device.");
         this.messageService.addVoiceMessage("Speech recognition not available on this device.");
        return;
    }

    try
    {
      // Start listening with partial results enabled for best behavior in this loop
      /*await SpeechRecognition.start({
        language: "en-US",
        partialResults: true,
        maxResults: 1,
        popup: false // Important for Android to prevent blocking UI
      });*/
      startRecognition();
      this.messageService.addVoiceMessage('Continuous listening started.');
    }
    catch (error)
    {
      console.error('Error starting speech recognition:', error);
      this.messageService.addVoiceMessage('Error starting speech recognition:'+error);
      this.isListeningContinuously = false; // Stop loop if start fails
    }
  }

  async stopListeningContinuously()
  {
    this.isListeningContinuously = false;
    await SpeechRecognition.stop();
    console.log('Continuous listening stopped manually.');
    this.messageService.addVoiceMessage('Continuous listening stopped manually.');
    // Optionally remove listeners here if necessary
  }

  getTranscript(): string {
    return this.finalTranscript;
  }
  constructor(private globalSettings:GlobalsettingsService,private zone:NgZone,private router:Router, private messageService: MessageService) { }
   populateVoiceList()
   {
      voices = synth.getVoices();

      for (const voice of voices)
      {
          const option = document.createElement("option");
          option.textContent = `${voice.name} (${voice.lang})`;

          if (voice.default)
          {
              option.textContent += " — DEFAULT";
          }

        option.setAttribute("data-lang", voice.lang);
        option.setAttribute("data-name", voice.name);
        if (voiceSelect)
          voiceSelect.appendChild(option);
    }
    this.messageService.addVoiceMessage("adding listeners222");
    if (this.globalSettings.getUseVoiceCommand())
    {

    }
  }
  GetvoiceRecorgintionRunning():boolean
  {
    return this.voiceRecorgintionRunning;

  }
  SetvoiceRecorgintionRunning(flag:boolean)
  {
    this.voiceRecorgintionRunning = flag;
  }
    getTotalValue(data: string[])
    {
      let str = "";
        for (let i = 0; i < data.length;++i)
          str += data[i];
       return str;
    }
  async startVoiceRecogintion()
  {
   // if (this.globalSettings.getUseMemoryDatabase())
   this.messageService.clear();
   if(this.globalSettings.getUseVoiceCommand())
  {

      /*const {available } = await SpeechRecognition.available();
      if (available)
      {
         this.messageService.addVoiceMessage("speech recogintion available.");
      }
      else
      {
         this.messageService.addVoiceMessage("speech recogintion not available.");
        return ;
      }
      SpeechRecognition.start({
        language: "en-US",
        maxResults: 2,
        prompt: "Say something",
        partialResults: true,
        popup: false,
      });

      SpeechRecognition.addListener("partialResults", (data: any) => {
        this.results = data.matches[0];
        this.get Result();
        alert("partialResults was fired "+ data.matches[0]);

      });*/
     if (await checkAndRequestPermissions())
     {
         this.messageService.addVoiceMessage("adding listeners");
        SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) =>
        {
          //this.messageService.addVoiceMessage('test:'+data + ' new');
          if (data.matches && data.matches.length > 0)
          {
            // You can update UI with data.matches[0] here if needed
            let str =  this.getTotalValue(data.matches);
            if (str !== "")
               this.messageService.addVoiceMessage('Partial result: '+ data.matches[0]);
            // Store the final confirmed result for continuous accumulation
            this.finalTranscript = str;

            this.results = this.finalTranscript;
            this.getResult();
            let voicetext:string = this.results;
            let stopText:string ="stop";
            ///console.log(voicetext.trim().toLowerCase() == stopText);
            if (voicetext.trim().toLowerCase() == stopText)
            {
              this.stopListening();
            }
            this.results = "";
          }
      });

      // Add listener to restart the service when it stops
      SpeechRecognition.addListener('listeningState', (data: { status: 'started' | 'stopped' }) =>
      {
        if (data.status === 'stopped' && this.isListeningContinuously)
        {
         this.messageService.addVoiceMessage('Listening stopped, restarting...');
          // Wait briefly to avoid potential race conditions
          setTimeout(() => this.startListeningContinuously(), 100);
        }
      });
       (SpeechRecognition.addListener as any)('results', (data: { matches: string[] }) =>
      {
        this.getTotalValue(data.matches);

         this.messageService.addVoiceMessage('from results:'+ data.matches);
      });

      (SpeechRecognition.addListener as any)('end', () =>
      {
         this.messageService.addVoiceMessage('from end.');
      });
        this.messageService.addVoiceMessage("voice recognition32 was granted.");
       // startRecognition();
          /*SpeechRecognition.start({
          language: "en-US",
          maxResults: 1,
          prompt: "Say something",
          partialResults: true,
          popup: false,
        });*/
        this.startListeningContinuously();

        /* SpeechRecognition.addListener("partialResults", (data: any) => {
          this.results = data.matches[0];
          this.getResult();
           this.messageService.addVoiceMessage("partialResults was fired "+ data.matches[0]);

        });*/
         this.SetvoiceRecorgintionRunning(true);
      }
      else
      {
        this.messageService.addVoiceMessage("voice recognition not granted");
      }
      return;
    }
    if ('webkitSpeechRecognition' in window) {
      this.messageService.addVoiceMessage("Starting voice recognition");
      const voiceMsgs = <HTMLElement>document.getElementById("Voice_Messages");
      if (voiceMsgs != undefined)
        voiceMsgs.innerHTML = "No Voice Messages yet";
      if (!this.vSearch)
      {
        this.vSearch = new webkitSpeechRecognition();
        this.vSearch.continuous = true;
        this.vSearch.interimresults = true;
        this.vSearch.lang = 'en-US';
      }
      /*var u = new SpeechSynthesisUtterance();
      u.text = 'Hello World';
      u.lang = 'en-US';
      u.rate = 1.2;
      console.log(speechSynthesis.getVoices());
      u.voice  = speechSynthesis.getVoices()[11];

      speechSynthesis.cancel();
      u.onend = function(event) { alert('Finished in ' + event.elapsedTime + ' seconds.');synth.cl }
      speechSynthesis.speak(u);
      u.voice  = speechSynthesis.getVoices()[3];*/
      this.vSearch.onerror = function(event:any) {
        console.error('Speech recognition error:', event.error);
        //alert('Speech recognition error: \n'+ event.error);
    };
      this.vSearch.start();
      alert('Speech recognition starting:');
      this.SetvoiceRecorgintionRunning(true);
      this.vSearch.onend = () => {
         if (this.GetvoiceRecorgintionRunning())
          this.vSearch.start();
           console.log("speech enging restarted");
      };
      this.vSearch.onspeechend = () => {
        console.log("Speech has stopped being detected");}
      this.vSearch.onresult = (e: { results: { transcript: any; }[][]; }) => {
        console.log(e,"from e");
        // voiceHandler.value = e?.results[0][0]?.transcript;
        let index1:number =  e.results.length -1 ;
        if (index1 < 0)
          index1 = 0;
        let index2:number = e.results[index1].length -1;
        if (index2 < 0)
          index2 = 0;
        this.results = e.results[index1][index2].transcript;
        ///console.log(index1,index2,this.results);
        this.getResult();
        // console.log(this.results);

        let voicetext:string = this.results;
        let stopText:string ="stop";
        ///console.log(voicetext.trim().toLowerCase() == stopText);
        if (voicetext.trim().toLowerCase() == stopText)
        {
          this.stopListening();
        }
        this.results = "";
      };
    }
    else
    {
      alert('Your browser does not support voice recognition!');
    }

  }
  stopListening()
  {
    this.SetvoiceRecorgintionRunning(false);
    if (this.globalSettings.getUseVoiceCommand())
    {
      this.stopListeningContinuously();
    }
    else
    {
      this.vSearch.stop();
    }
    this.messageService.addVoiceMessage("Stop voice recognition");
    const voiceMsgs = <HTMLElement>document.getElementById("Voice_Messages");
    if (voiceMsgs != undefined)
      voiceMsgs.innerHTML += "\nStop voice recognition";

  }
  showInfoSofar()
  {
    let textsofar:string = "";
    if (this.currentReport.reportName != "")
       textsofar += "reportName= "+this.currentReport.reportName;

       if (this.currentReport.fromDate != "")
       textsofar += " fromdate= "+this.currentReport.fromDate;

     if (this.currentReport.toDate != "")
       textsofar += " toDate= "+this.currentReport.toDate;

   if (this.currentReport.customerName != "")
       textsofar += " customerName= "+this.currentReport.customerName;

       console.log(textsofar);
  }
  executeReport():void
  {
       console.log(`Excuting report ${this.currentReport.reportName} command = ${this.currentReport.command} from ${this.currentReport.fromDate} to ${this.currentReport.toDate} for customer ${this.currentReport.customerName}`)
       let text:string = "";
       text = `you want to generate  ${this.currentReport.reportName} for ${this.currentReport.customerName} from ${this.currentReport.fromDate} to ${this.currentReport.toDate} `;
       speechSynthesis.speak(new SpeechSynthesisUtterance(text));

  }
  generateReport(text:string)
  {
    this.currentReport.executeReportParam = this.currentReport.setReportInfo(text);
    if ( !this.currentReport.executeReportParam.validReport)
    {
       this.showInfoSofar();
       console.log(this.currentReport.executeReportParam.response);
       console.log(window.speechSynthesis.getVoices());
       ///const utterThis = new SpeechSynthesisUtterance(this.currentReport.executeReportParam.response);
      /// let u = window.speechSynthesis.cancel();
       //utterThis.onend = function(event) { window.speechSynthesis.pause();window.speechSynthesis.cancel(); };
       ///window.speechSynthesis.speak(utterThis)
       var u = new SpeechSynthesisUtterance();
      u.text = this.currentReport.executeReportParam.response;
      u.lang = 'en-US';
      u.rate = 1.2;
     // u.onend = function(event,vSearch) { vSearch.ss }
      speechSynthesis.speak(u);
       return;
    }
    this.executeReport();
    this.currentReport.reset();
    return;
  }
  getResult()
  {
    console.log(this.results, "from results");
    //this.messageService.addVoiceMessage("from results "+this.results);
    const voiceMsgs = <HTMLElement>document.getElementById("Voice_Messages");
    if (voiceMsgs != undefined)
      voiceMsgs.innerHTML  += this.results;

      let result:string = this.results;
      result = result.trim().toLowerCase() ;
      if (this.ExecuteCommand(result))
        return;

   this.generateReport(result);
   //this.currentReport.generateReport("Generate general Ledger from first January 2002 to 2nd January 2002 for customer ABC");

  }
  ExecuteCommand(cmdstring:string):boolean
  {
    if (cmdstring.endsWith("."))
    {
      //console.log(cmdstring+"newst");
      cmdstring = cmdstring.slice(0, -1);
     /// console.log(cmdstring);
    }
    console.log("from execute cmd "+cmdstring);
   /// this.messageService.addVoiceMessage("from execute cmd "+cmdstring);
    for(let i = 0; i < this.commands.length;++i)
    {
      if ((this.commands[i].id ==  cmdstring) && (this.commands[i].type == commandtype.LINKROUT))
      {
        console.log(this.commands[i].path);
      // this.router.navigate([commands[i].path]);
        this.zone.run(() => {
          this.router.navigate([this.commands[i].path]);
      });
      return true;
      }
    }
    let cmdPageId = "";
    let pageid = document.getElementById("transaction");
    console.log(pageid);
    if(pageid)
    {
      cmdPageId = "transaction";
    }
    else
    {
      pageid = document.getElementById("accountstree");
      console.log(pageid);
      if(pageid)
      {
        cmdPageId = "accountstree";
      }
      else
      {
        pageid = document.getElementById("listoftransactions");
         if(pageid)
        {
          cmdPageId = "listoftransactions";
        }
      }
    }
    console.log("page id ",cmdPageId)
    for(let i = 0; i < this.commands.length;++i)
    {
      if (cmdstring.indexOf(this.commands[i].id) != 0)
      {
          continue;
      }
      if ((cmdPageId !== "") &&(cmdPageId.indexOf(this.commands[i].pageid) != 0))
      {

          let currentPageId =  this.commands[i].pageid;
          if((currentPageId === "listoftransactions")&&(cmdPageId !== "listoftransactions"))
          {
             cmdPageId = "listoftransactions";
              this.zone.run(() => {
              this.router.navigate(["transaction"], { queryParams: { action:this.commands[i].path } });
               console.log("continue " ,cmdPageId,this.commands[i].pageid);
          });
          return true;
          }
          else
            continue;
      }

      console.log("found cmd at ",i);
      let elementid:string = this.commands[i].path;
      let cmdType:commandtype = this.commands[i].type;

      if ((cmdPageId === "accountstree") && (cmdType === commandtype.BUTTON))
      {
        console.log(" add dsfd",cmdstring);
         if (cmdstring === "add")
         {
              cmdstring =  cmdstring.replace("add","");
              elementid += cmdstring;
         }
         else  if (cmdstring === "edit")
         {
           cmdstring =  cmdstring.replace("edit","");
           elementid += cmdstring;
         }
         else  if (cmdstring === "delete")
         {
             cmdstring =  cmdstring.replace("delete","");
             elementid += cmdstring;
         }
         elementid = cmdstring;
         console.log("final emle "+elementid,"cmd str"+cmdstring);
      }

      if (cmdType == commandtype.INPUTBOX)
      {
        const x = <HTMLInputElement>document.getElementById(elementid);
        console.log(x);

        cmdstring = cmdstring.replace("write name","");
        cmdstring = cmdstring.replace("right name","");
        if(x != undefined)
        {
            x.value = cmdstring;
        }
        else
        {
          console.log("undefined");
        }
        return true;
      }
      else if (cmdType == commandtype.BUTTON)
      {
        if (elementid == 'FindAndDeleteAccount')
        {

        }
        const x = <HTMLButtonElement>document.getElementById(elementid);
        console.log("button ",x,elementid);
        if(x != undefined)
        {
            //x.click();
            x.dispatchEvent(new MouseEvent('click'));
            console.log(x);


        }
        else
        {
          console.log("undefined btn");
        }
        return true;
      }
      else if (cmdType == commandtype.CHECKBOX)
      {
        const x = <HTMLInputElement >document.getElementById(elementid);
        console.log(x);
        if(x != undefined)
        {
            //x.checked = !x.checked;
            x.dispatchEvent(new MouseEvent('click'));
        }
        else
        {
          console.log("undefined chk box");
        }
        return true;
      }
      return true;
    }
    return false;
  }


}

