import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Analysis, AnalysisTypeEnum } from 'src/app/model/ai-advice.model';
import { BillService } from 'src/app/services/bill.service';
import { ThemeService } from 'src/app/services/theme.service';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DialogMessage } from 'src/app/services/dialog-message.service';

@Component({
  selector: 'app-ai-analysis-list',
  templateUrl: './ai-analysis-list.component.html',
  styleUrls: ['./ai-analysis-list.component.scss']
})
export class AiAnalysisListComponent implements OnInit {
  @ViewChild('dp') datePicker: MatDatepicker<Date>;
  @ViewChild('startDp') startDatePicker: MatDatepicker<Date>;

  analyses: Analysis[] = [];
  filteredAnalyses: Analysis[] = [];
  filterDate: string = '';
  filterType: string = '';
  loading: boolean = false;
  darkMode: boolean;

  analysisTypeListLabels = [
    {id: '1', label: 'Mensal'},
    {id: '2', label: 'Trimestral'},
    {id: '3', label: 'Anual'}
  ]

  filterForm: FormGroup;
  selectedDate: Date;

  constructor(private router: Router, 
    private billService: BillService, 
    private themeService: ThemeService, 
    private dateAdapter: DateAdapter<any>, 
    private formBuilder: FormBuilder,
    private dialogMessage: DialogMessage) {
    this.filterForm = this.formBuilder.group({
      date: new FormControl(null),
      type: new FormControl(''),
      startDate: new FormControl(null),
    });
    

    this.dateAdapter.setLocale('pt-BR');
  }

  ngOnInit(): void {
    this.darkMode = this.themeService.checkDarkMode();
    this.loadAnalysis();

    this.filterForm.get('startDate')?.valueChanges.subscribe(() => this.filterAnalyses());
    this.filterForm.get('type')?.valueChanges.subscribe(() => this.filterAnalyses());
    this.filterForm.get('date')?.valueChanges.subscribe(() => this.filterAnalyses());
  }

  filterAnalyses(): void {
    const dateValue = this.filterForm.get('date')?.value;
    const typeValue = this.filterForm.get('type')?.value;
    const startDateValue = this.filterForm.get('startDate')?.value;

    this.filteredAnalyses = this.analyses.filter(analysis => 
      (dateValue ? analysis.date.startsWith(this.formatDate(dateValue)) : true) &&
      (typeValue ? analysis.analysisType.toString() == typeValue.toString() : true) && 
      (startDateValue ? analysis.startDate.startsWith(this.formatDate(dateValue)) : true)
    );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${year}-${month}`;
  }

  viewAnalysis(analysisId: number): void {
    this.router.navigate(['fs/ai-analysis-detail', analysisId]);
  }

  loadAnalysis(): void {
    this.isLoading();
    this.billService.getAiAdvices().then((data) => {
      data.forEach((register) => {
        register.analysisType = this.analysisTypeListLabels.filter(type => type.id == register.analysisType)[0].label;
      });

      this.analyses = data;
      this.filteredAnalyses = data;
    })
    .catch((error) => {
      this.dialogMessage.openErrorDialog(error.message);
    })
    .finally(() => {
      this.isLoading();
    });
  }

  isLoading() {
    this.loading = !this.loading;
  }

  onDateChange(event: any) {
    const selectedYear = event.getFullYear();
    const selectedMonth = event.getMonth();

    this.selectedDate = new Date(selectedYear, selectedMonth, 1);
    this.filterForm.controls['date'].setValue(this.selectedDate);

    this.datePicker.close();
  }

  onStartDateChange(event: any) {
    const selectedYear = event.getFullYear();
    const selectedMonth = event.getMonth();

    this.selectedDate = new Date(selectedYear, selectedMonth, 1);
    this.filterForm.controls['startDate'].setValue(this.selectedDate);

    this.startDatePicker.close();
  }

  openAiAnalysisDialog(): void {
    this.router.navigate(['fs/main', 'ai-analysis-dialog']);
  }

  deleteAnalysis(analysisId: number): void {
    this.isLoading();
    this.billService.deleteAiAnalysis(analysisId).then((result) => {
      this.dialogMessage.openInfoDialog("Análise "+analysisId+" excluída com sucesso");
    })
    .catch((error) => {
      this.dialogMessage.openErrorDialog(error.message);
    })
    .finally(() => {
      this.isLoading();
    });

    this.loadAnalysis();
  }
}
