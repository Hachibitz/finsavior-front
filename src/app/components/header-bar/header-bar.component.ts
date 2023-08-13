import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  darkMode: boolean = false;

  ngOnInit() {
    this.darkMode = this.themeService.checkDarkMode();
  }

  constructor(private themeService: ThemeService) {

  }

  toggleDarkMode() {
    this.darkMode = sessionStorage.getItem('dark-mode') == 'true' ? true : false;
    const headerBar = document.getElementById('headerBar');
    headerBar.classList.toggle('dark-mode', this.darkMode);
  }
}
