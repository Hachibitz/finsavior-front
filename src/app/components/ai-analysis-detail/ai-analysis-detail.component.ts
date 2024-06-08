import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Analysis } from 'src/app/model/ai-advice.model';
import { BillService } from 'src/app/services/bill.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-ai-analysis-detail',
  templateUrl: './ai-analysis-detail.component.html',
  styleUrls: ['./ai-analysis-detail.component.scss']
})
export class AiAnalysisDetailComponent implements OnInit {
  analysisId: number | null = null;
  analysis: Analysis | null = null;
  loading: boolean = false;
  darkMode: boolean;

  constructor(private route: ActivatedRoute, private billService: BillService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isLoading();
    this.route.paramMap.subscribe(params => {
      const analysisId = Number(params.get('id'));
      if (analysisId) {
        this.billService.getAiAdvices().then((data) => {
          this.analysis = data.find(a => a.id === analysisId) || null;
        })
        .catch((error) => {

        })
        .finally(() => {
          this.isLoading();
        });
      }
    });

    this.darkMode = this.themeService.checkDarkMode();
  }

  isLoading() {
    this.loading = !this.loading;
  }
}
