import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-table-dialog',
  templateUrl: './edit-table-dialog.component.html',
  styleUrls: ['./edit-table-dialog.component.scss']
})
export class EditTableDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditTableDialogComponent>) {
    
  }

  onSave() {
    this.dialogRef.close('salvar');
  }
  
  onCancel() {
    // Botão "Cancelar" pressionado, não há necessidade de definir um resultado específico.
    this.dialogRef.close();
  }
}
