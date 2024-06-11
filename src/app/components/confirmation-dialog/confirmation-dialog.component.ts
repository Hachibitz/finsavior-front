import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditTableDialogComponent } from '../edit-table-dialog/edit-table-dialog.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  public constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditTableDialogComponent>){
    
  }

  onSave() {
    this.dialogRef.close('Sim');
  }
  
  onCancel() {
    this.dialogRef.close();
  }
}
