import { MessageService } from './../message/message.service';
import { Injectable } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Injectable({
  providedIn: 'root',
})
export class EmailService
{
  constructor(private emailComposer: EmailComposer,private messageService:MessageService) {

  }
  /*async sendEmailWithAttachment1(fileName:string)
{
    // 1. Prepare a dummy file (example: saving a text file)

    try {
      // Save the file to the app's internal files directory


      // Get the full native path (platform-specific)
      const fileUri = await Filesystem.getUri({
        directory: Directory.Files,
        path: fileName
      });

      // Format the attachment path for the Email Composer
      // The path format depends on the OS (Android uses 'file://')
      const attachmentPath = this.platform.is('android') ?
        fileUri.uri.replace('file://', '') :
        fileUri.uri;


      // 2. Compose and open the email
      await EmailComposer.open({
        to: ['recipient@example.com'],
        subject: 'Email with Attachment',
        body: 'Here is the pre-filled body text, please see the attachment.',
        attachments: [
          {
            type: 'absolute', // Use 'absolute' path type
            path: attachmentPath
          }
        ]
      });

    }
    catch (error)
    {
      console.error('Error handling files or composing email:', error);
      alert('Could not open email app or save file.');
    }
  }*/

   async sendEmailWithAttachment(uri:string,emailAddress:string,subject:string,body:string)
   {
      try
      {
          let isAvailable = await this.emailComposer.isAvailable();
          if (isAvailable)
          {
            // Format the attachment path for the Email Composer
            // The path format depends on the OS (Android uses 'file://')
          // const fileUri = await Filesystem.getUri({directory: Directory.Documents,path: fileName});
          /// const attachmentPath = this.platform.is('android') ?fileUri.uri.replace('file://', '') :fileUri.uri;
          let email = {
            to: [emailAddress], // 'to' is an array of strings
            subject: `${subject}`,
            body: `${body}`,
            attachments: [
              uri // The file URI obtained from Filesystem
            ],
            isHtml: true,
          };
          this.emailComposer.open(email);

        }
        else
        {
          // Handle the case where no email client is installed (e.g., on some tablets/emulators)
          console.warn('No email client available on this device.');
          alert('You do not have an email application installed.');
        }


      }
      catch(e)
      {
          this.messageService.addVoiceMessage("email "+uri+ " failed. "+e);
      }
  }
  /*async  sharePdf(filePath: string)
   {
  try {
    await Share.share({
      title: 'Share PDF Report',
      text: 'Please find the attached PDF report.',
      files: [filePath], // Pass the file URI obtained from Filesystem
      dialogTitle: 'Share with',
    });
  } catch (error) {
    console.error('Error sharing the PDF:', error);
  }
}*/
}
