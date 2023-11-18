import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogMessagesComponent } from "../components/dialog-messages/dialog-messages.component";
import { delay, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DialogMessage {
    constructor(private dialog: MatDialog){

    }

    openErrorDialog(errorMessage: string): void {
        this.dialog.open(DialogMessagesComponent, {
          data: { message: errorMessage, 
                  name: "Erro",
                  messageType: "error"
                },
        });
        of('Após 5 segundos').pipe(delay(5000)).subscribe(result => {
          this.dialog.closeAll();
        });
      }
    
      openWarnDialog(warnMessage: string): void {
        this.dialog.open(DialogMessagesComponent, {
          data: { message: warnMessage, 
                  name: "Aviso",
                  messageType: "warn"
                },
        });
        of('Após 3 segundos').pipe(delay(3000)).subscribe(result => {
          this.dialog.closeAll();
        });
      }
    
      openInfoDialog(infoMessage: string): void {
        this.dialog.open(DialogMessagesComponent, {
          data: { message: infoMessage, 
                  name: "Success",
                  messageType: "info"
                },
        });
        of('Após 2 segundos').pipe(delay(2000)).subscribe(result => {
          this.dialog.closeAll();
        });
      }
}