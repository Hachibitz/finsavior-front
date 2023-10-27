import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditTableDialogComponent } from '../edit-table-dialog/edit-table-dialog.component';

@Component({
  selector: 'app-recurrent-bill-dialog',
  templateUrl: './recurrent-bill-dialog.component.html',
  styleUrls: ['./recurrent-bill-dialog.component.scss']
})
export class RecurrentBillDialogComponent {
  public constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditTableDialogComponent>){
    
  }

  onSave() {
    this.dialogRef.close('salvar');
  }
  
  onCancel() {
    this.dialogRef.close();
  }
}
