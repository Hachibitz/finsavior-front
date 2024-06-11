import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-ai-advices',
  templateUrl: './ai-advices.component.html',
  styleUrls: ['./ai-advices.component.scss']
})
export class AiAdvicesComponent implements OnInit {
  loading: boolean = false;
  darkMode: any;

  constructor(private themeService: ThemeService) {

  }

  ngOnInit(): void {
      this.darkMode = this.themeService.checkDarkMode();
  }
}
