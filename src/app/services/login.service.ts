import { Injectable } from '@angular/core';
import { SERVICE_LOGIN } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { LoginRequest } from '../model/main.model';

@Injectable({ providedIn: 'root' })
export class LoginService {

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
}