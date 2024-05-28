import { Component } from '@angular/core';

@Component({
  selector: 'app-plans-page',
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.scss']
})
export class PlansPageComponent {
  loading: boolean = false;
  darkMode: boolean = true;
}
