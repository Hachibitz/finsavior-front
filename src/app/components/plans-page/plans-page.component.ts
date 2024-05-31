import { Component, OnInit } from '@angular/core';
import { PLANS_LIST } from 'src/app/model/payment.model';
import { LoadingService } from 'src/app/services/loading-service';

@Component({
  selector: 'app-plans-page',
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.scss']
})
export class PlansPageComponent implements OnInit {
  
  loading: boolean = false;
  darkMode: boolean = true;

  plusPlanId: string = PLANS_LIST[1].id;

  constructor(private loadingService: LoadingService) {

  }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
  }
}
