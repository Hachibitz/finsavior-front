import { Injectable } from '@angular/core';
import { LOAD_MAIN_TABLE_DATA, MAIN_SERVICE_BILL_REGISTER } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { BillRegisterRequest, MainTableDataResponse } from '../model/main.model';

@Injectable({ providedIn: 'root' })
export class BillService {

    constructor(private http: HttpClient) { }

    billRegister(saveRequest: BillRegisterRequest): Promise<string> {
        const promessa = new Promise<string>((resolve, reject) => {
            this.http.post(MAIN_SERVICE_BILL_REGISTER, saveRequest, { responseType: 'json' }).subscribe({
                next: (result: string) => {
                    //console.log(result);
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    //console.log(e);
                    reject(e);
                },
            });
        });
        return promessa;
    };

    loadMainTableData(): Promise<MainTableDataResponse> {
        const promessa = new Promise<MainTableDataResponse>((resolve, reject) => {
            this.http.get(LOAD_MAIN_TABLE_DATA, { responseType: 'json' }).subscribe({
                next: (result: MainTableDataResponse) => {
                    //console.log(result);
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    //console.log(e);
                    reject(e);
                },
            });
        });
        return promessa;
    };
}