import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-suggestion-page',
  templateUrl: './suggestion-page.component.html',
  styleUrls: ['./suggestion-page.component.scss']
})
export class SuggestionPageComponent implements OnInit {
  darkMode: boolean = false;
  suggestionForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.initForm();
    this.darkMode = this.themeService.checkDarkMode();
  }

  initForm(): void {
    this.suggestionForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      suggestion: ['', Validators.required]
    });
  }

  submitSuggestion(): void {
    if (this.suggestionForm.valid) {
      this.loading = true;
      console.log('Suggestion submitted:', this.suggestionForm.value);
      this.suggestionForm.reset();
      this.loading = false;
    } else {
      console.log('Invalid form. Please check your inputs.');
    }
  }
}
