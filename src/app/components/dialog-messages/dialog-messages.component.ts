import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-messages',
  templateUrl: './dialog-messages.component.html',
  styleUrls: ['./dialog-messages.component.scss']
})
export class DialogMessagesComponent {
  errorMessage: boolean = false;
  warnMessage: boolean = false;
  infoMessage: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.errorMessage = data.messageType == 'error' ? true : false;
    this.warnMessage = data.messageType == 'warn' ? true : false;
    this.infoMessage = data.messageType == 'info' ? true : false;
  }
}
