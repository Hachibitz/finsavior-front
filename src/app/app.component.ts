import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title: string = 'FinSavior';

  constructor(private router: Router){
    
  }

  ngOnInit(){
    
  }

  private navigateToMain(): void{
    this.router.navigate(['fs/main']);
  }
}
