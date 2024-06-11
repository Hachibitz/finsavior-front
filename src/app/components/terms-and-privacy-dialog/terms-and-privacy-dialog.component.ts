import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditTableDialogComponent } from '../edit-table-dialog/edit-table-dialog.component';
import { TermsAndPrivacyService } from 'src/app/services/terms-and-privacy-service';

@Component({
  selector: 'app-terms-and-privacy-dialog',
  templateUrl: './terms-and-privacy-dialog.component.html',
  styleUrls: ['./terms-and-privacy-dialog.component.scss']
})
export class TermsAndPrivacyDialogComponent implements OnInit {
  public contentTitle: string;
  public contentText: string;
  private contentTerms: string;
  private contentPrivacy: string;

  loading: boolean = false;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TermsAndPrivacyDialogComponent>,
    private termsAndPrivacyService: TermsAndPrivacyService
  ) {
    this.contentTitle = data.type === 'privacy' ? 'Política de Privacidade' : 'Termos e Condições';
    //this.contentText = data.type === 'privacy' ? this.getPrivacyPolicy() : this.getTermsAndConditions();
  }

  async ngOnInit(): Promise<void> {
    if (this.data.type === 'privacy') {
      this.contentText = await this.getPrivacyPolicy();
    } else {
      this.contentText = await this.getTermsAndConditions();
    }
  }

  onSave() {
    this.dialogRef.close('salvar');
  }

  onCancel() {
    this.dialogRef.close();
  }

  private async getTermsAndConditions(): Promise<string> {
    this.isLoading();
    try {
      const result = await this.termsAndPrivacyService.loadTermsAndConditions();
      this.contentTerms = result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      this.isLoading();
    }
    return this.contentTerms;
  }

  private async getPrivacyPolicy(): Promise<string> {
    this.isLoading();
    try {
      const result = await this.termsAndPrivacyService.loadPrivacyPolicy();
      this.contentPrivacy = result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      this.isLoading();
    }
    return this.contentPrivacy;
  }

  isLoading(): void {
    this.loading = !this.loading;
  }
}
