import { Injectable } from '@angular/core';
import { CHANGE_ACCOUNT_PASSWORD, DELETE_ACCOUNT_AND_DATA, SERVICE_LOGIN, SIGNUP_SERVICE } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { ChangeAccountPasswordRequest, DeleteAccountAndDataRequest, DeleteAccountAndDataResponse, LoginRequest, SignUpRequest, SignUpResponse } from '../model/user.model';
import { CookieService } from 'ngx-cookie-service';
import { GenericResponse } from '../model/main.model';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    deleteAccountAndData(deleteAccountAndDataRequest: DeleteAccountAndDataRequest): Promise<DeleteAccountAndDataResponse> {
        const promessa = new Promise<DeleteAccountAndDataResponse>((resolve, reject) => {
            this.http.post(DELETE_ACCOUNT_AND_DATA, deleteAccountAndDataRequest, { responseType: 'json' }).subscribe({
                next: (result: DeleteAccountAndDataResponse) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e.error);
                },
            });
        });
        return promessa;
    }

    changeAccountPassword(changeAccountPasswordRequest: ChangeAccountPasswordRequest): Promise<DeleteAccountAndDataResponse> {
        const promessa = new Promise<GenericResponse>((resolve, reject) => {
            this.http.post(CHANGE_ACCOUNT_PASSWORD, changeAccountPasswordRequest, { responseType: 'json' }).subscribe({
                next: (result: GenericResponse) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e.error);
                },
            });
        });
        return promessa;
    }
}