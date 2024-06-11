import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Analysis } from 'src/app/model/ai-advice.model';
import { BillService } from 'src/app/services/bill.service';
import { DialogMessage } from 'src/app/services/dialog-message.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: "app-ai-analysis-detail",
  templateUrl: "./ai-analysis-detail.component.html",
  styleUrls: ["./ai-analysis-detail.component.scss"],
})
export class AiAnalysisDetailComponent implements OnInit {
  analysisId: number | null = null;
  analysis: Analysis | null = null;
  loading: boolean = false;
  darkMode: boolean;
  analysisTypeListLabels = [
    { id: "1", label: "Mensal" },
    { id: "2", label: "Trimestral" },
    { id: "3", label: "Anual" },
  ];

  constructor(
    private route: ActivatedRoute,
    private billService: BillService,
    private themeService: ThemeService,
    private router: Router,
    private dialogMessage: DialogMessage,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading();
    this.route.paramMap.subscribe((params) => {
      const analysisId = Number(params.get("id"));
      if (analysisId) {
        this.billService
          .getAiAdvices()
          .then((data) => {
            data.forEach((register) => {
              register.analysisType = this.analysisTypeListLabels.filter(
                (type) => type.id == register.analysisType
              )[0].label;
            });

            this.analysis = data.find((a) => a.id === analysisId) || null;
          })
          .catch((error) => {})
          .finally(() => {
            this.isLoading();
          });
      }
    });

    this.darkMode = this.themeService.checkDarkMode();
  }

  isLoading(): void {
    this.loading = !this.loading;
  }

  deleteAnalysis(analysisId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Sim') {
        this.isLoading();
        this.billService.deleteAiAnalysis(analysisId).then((result) => {
          this.returnToListPage();
          this.isLoading();
        })
        .catch((error) => {
          this.dialogMessage.openErrorDialog(error.message);
          this.isLoading();
        })
      } else {

      }
    });
  }
  
  returnToListPage(): void {
    this.router.navigate(['fs/ai-analysis-list']);
  }
}
