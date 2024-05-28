import { Component, Inject, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnalysisTypeEnum } from 'src/app/model/ai-advice.model';

@Component({
  selector: 'app-ai-advice-dialog',
  templateUrl: './ai-advice-dialog.component.html',
  styleUrls: ['./ai-advice-dialog.component.scss']
})
export class AiAdviceDialogComponent {
  @ViewChild('dp') datePicker: MatDatepicker<Date>;

  analysisTypes = [AnalysisTypeEnum.FREE, AnalysisTypeEnum.TRIMESTER, AnalysisTypeEnum.ANNUAL];

  selectedAnalysisType: string;
  selectedDate: Date;
  dialogData;

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AiAdviceDialogComponent>,
    private dateAdapter: DateAdapter<Date>,
    private fb: FormBuilder
  ) {
    this.dateAdapter.setLocale('pt-BR');

    this.form = this.fb.group({
      analysisType: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSave() {
    if (this.form.valid) {
      const dialogData = {
        analysisTypeId: this.form.value.analysisType,
        selectedDate: this.form.value.date
      };

      this.dialogRef.close(dialogData);
    } else {
      this.form.markAllAsTouched();
    }
  }  
  
  onCancel() {
    this.dialogRef.close('cancel');
  }

  onDateChange(event: any) {
    const selectedYear = event.getFullYear();
    const selectedMonth = event.getMonth();

    this.selectedDate = new Date(selectedYear, selectedMonth, 1);
    this.form.controls['date'].setValue(this.selectedDate);

    this.datePicker.close();
  }
}
