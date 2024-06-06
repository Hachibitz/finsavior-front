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
      { value: 0.25},
      { value: 0.5},
      { value: 0.75},
      { value: 1, legend: "Equilibrado" },
      { value: 1.25 },
      { value: 1.5 },
      { value: 1.75 },
      { value: 2, legend: "Mais criativo" }
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
      const dialogData = {
        analysisTypeId: this.form.value.analysisType,
        selectedDate: this.form.value.date,
        temperature: this.temperatureSliderValue
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
