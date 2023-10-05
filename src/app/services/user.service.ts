import { Injectable } from '@angular/core';
import { DELETE_ACCOUNT_AND_DATA, SERVICE_LOGIN, SIGNUP_SERVICE } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { DeleteAccountAndDataRequest, DeleteAccountAndDataResponse, LoginRequest, SignUpRequest, SignUpResponse } from '../model/user.model';
import { CookieService } from 'ngx-cookie-service';

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
                    reject(e);
                },
            });
        });
        return promessa;
    }
}