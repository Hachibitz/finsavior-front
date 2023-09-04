import { Injectable } from '@angular/core';
import { SERVICE_LOGIN, SIGNUP_SERVICE } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { LoginRequest, SignUpRequest, SignUpResponse } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    login(loginRequest: LoginRequest): Promise<string> {
        const promessa = new Promise<string>((resolve, reject) => {
            this.http.post(SERVICE_LOGIN, loginRequest, { responseType: 'text' }).subscribe({
                next: (result: string) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                },
            });
        });
        return promessa;
    };

    signUp(signUpRequest: SignUpRequest): Promise<SignUpResponse> {
        const promessa = new Promise<SignUpResponse>((resolve, reject) => {
            this.http.post(SIGNUP_SERVICE, signUpRequest, { responseType: 'json' }).subscribe({
                next: (result: SignUpResponse) => {
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