import { Injectable } from '@angular/core';
import { DELETE_ITEM_CARD_TABLE, 
         DELETE_ITEM_MAIN_TABLE, 
         LOAD_CARD_TABLE_DATA, 
         LOAD_MAIN_TABLE_DATA, 
         MAIN_SERVICE_BILL_REGISTER } from 'src/environments/environment';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams
} from '@angular/common/http';
import { BillRegisterRequest, CardTableDataResponse, GenericResponse, MainTableDataResponse } from '../model/main.model';

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

    loadCardTableData(): Promise<CardTableDataResponse> {
        const promessa = new Promise<CardTableDataResponse>((resolve, reject) => {
            this.http.get(LOAD_CARD_TABLE_DATA, { responseType: 'json' }).subscribe({
                next: (result: CardTableDataResponse) => {
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

    deleteItemFromMainTable(itemId: number): Promise<GenericResponse> {
        const promessa = new Promise<GenericResponse>((resolve, reject) => {
            const params = new HttpParams().set('itemId', itemId.toString());

            this.http.delete(DELETE_ITEM_MAIN_TABLE, { params: params, responseType: 'json' }).subscribe({
                next: (result: GenericResponse) => {
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

    deleteItemFromCardTable(itemId: number): Promise<GenericResponse> {
        const promessa = new Promise<GenericResponse>((resolve, reject) => {
            const params = new HttpParams().set('itemId', itemId.toString());

            this.http.delete(DELETE_ITEM_CARD_TABLE, { params: params, responseType: 'json' }).subscribe({
                next: (result: GenericResponse) => {
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