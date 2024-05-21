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
      // You can implement the logic to send the suggestion via email here
      console.log('Suggestion submitted:', this.suggestionForm.value);
      // Optionally, you can reset the form after submission
      this.suggestionForm.reset();
    } else {
      // Handle invalid form
      console.log('Invalid form. Please check your inputs.');
    }
  }
}
