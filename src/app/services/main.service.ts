import { Injectable } from '@angular/core';
import { MAIN_SERVICE_BILL_REGISTER } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { SaveRequest } from '../model/main.model';

@Injectable({ providedIn: 'root' })
export class MainService {

    constructor(private http: HttpClient) { }

    billRegister(saveRequest: SaveRequest): Promise<string> {
        const promessa = new Promise<string>((resolve, reject) => {
            this.http.post(MAIN_SERVICE_BILL_REGISTER, saveRequest, { responseType: 'json' }).subscribe({
                next: (result: string) => {
                    console.log(result);
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    console.log(e);
                    reject(e);
                },
            });
        });
        return promessa;
    };
}