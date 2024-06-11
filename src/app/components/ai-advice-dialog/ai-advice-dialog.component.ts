import { Component, Inject, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnalysisTypeEnum } from 'src/app/model/ai-advice.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { PlanCoverageEnum } from 'src/app/model/payment.model';
import { Options } from '@angular-slider/ngx-slider';

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

  userHasNeededPlan = false;

  temperatureSliderValue: number = 0;
  sliderOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0, legend: "Mais precisão" },
      { value: 0.1 },
      { value: 0.2 },
      { value: 0.3 },
      { value: 0.4 },
      { value: 0.5, legend: "Equilibrado" },
      { value: 0.6 },
      { value: 0.7 },
      { value: 0.8 },
      { value: 0.9 },
      { value: 1, legend: "Mais criativo" }
    ],
    disabled: false
  };

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AiAdviceDialogComponent>,
    private dateAdapter: DateAdapter<Date>,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.dateAdapter.setLocale('pt-BR');

    this.form = this.fb.group({
      analysisType: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.checkUserPlan();
  }

  onSave() {
    if (this.form.valid) {
      const analysisType = this.analysisTypes.filter(analysisType => analysisType.analysisTypeId == this.form.value.analysisType)[0];

      const selectedDate = new Date(this.form.value.date);
      const finishDate = new Date(selectedDate);
      finishDate.setMonth(selectedDate.getMonth() + analysisType.period);
      finishDate.setDate(finishDate.getDate() - 1);
      finishDate.setHours(23,59,59);
      selectedDate.setHours(0,0,0);

      const dialogData = {
        analysisTypeId: this.form.value.analysisType,
        selectedDate: selectedDate,
        temperature: this.temperatureSliderValue,
        finishDate: finishDate
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

  checkUserPlan(): void {
    this.userService.getProfileData().then((result) => {
      this.userHasNeededPlan = result.plan.planId !== PlanCoverageEnum.FREE.planId;
      this.updateSliderState();
    }).catch((error) => {
      this.userHasNeededPlan = false;
      this.updateSliderState();
    });
  }

  updateSliderState() {
    this.sliderOptions = Object.assign({}, this.sliderOptions, {disabled: !this.userHasNeededPlan});
  }

  upgradePlan(): void {
    this.dialogRef.close('cancel');
    this.router.navigate(['/fs/plans']);
  }
}
