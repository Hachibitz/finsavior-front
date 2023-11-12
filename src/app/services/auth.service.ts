import { Injectable } from '@angular/core';
import { SERVICE_LOGIN, SIGNUP_SERVICE, VALIDATE_TOKEN_SERVICE } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { LoginRequest, SignUpRequest, SignUpResponse } from '../model/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    login(loginRequest: LoginRequest): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.http.post(SERVICE_LOGIN, loginRequest, { responseType: 'text', withCredentials: true }).subscribe({
                next: (result: string) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                },
            });
        });
    }

    logout(): void {
        this.deleteCookie('token');
    }

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

    getToken(): string {
        return this.cookieService.get('token');
    }

    deleteCookie(cookieName: string): void {
        this.cookieService.delete(cookieName, '/');
    }

    validateToken(token: string): Promise<boolean> {
        const url = VALIDATE_TOKEN_SERVICE+"?token="+token;
        const promessa = new Promise<boolean>((resolve, reject) => {
            this.http.get(url, { responseType: 'json' }).subscribe({
                next: (result: boolean) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                },
            });
        });
        return promessa;
    }

    async isAuthenticated(): Promise<boolean> {
        try {
          const result = await this.validateToken(this.getToken());
          return result;
        } catch (error) {
          return false;
        }
      }
}