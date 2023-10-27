import { Injectable } from '@angular/core';
import { DELETE_ITEM_CARD_TABLE, 
         DELETE_ITEM_MAIN_TABLE, 
         EDIT_ITEM_CARD_TABLE, 
         EDIT_ITEM_MAIN_TABLE, 
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
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                },
            });
        });
        return promessa;
    };

    loadMainTableData(billDate: string): Promise<MainTableDataResponse> {
        const params = new HttpParams().set('billDate', billDate);

        const promessa = new Promise<MainTableDataResponse>((resolve, reject) => {
            this.http.get(LOAD_MAIN_TABLE_DATA, { params: params, responseType: 'json' }).subscribe({
                next: (result: MainTableDataResponse) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                },
            });
        });
        return promessa;
    };

    loadCardTableData(billDate: string): Promise<CardTableDataResponse> {
        const params = new HttpParams().set('billDate', billDate);

        const promessa = new Promise<CardTableDataResponse>((resolve, reject) => {
            this.http.get(LOAD_CARD_TABLE_DATA, { params: params, responseType: 'json' }).subscribe({
                next: (result: CardTableDataResponse) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
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
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
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
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                },
            });
        });
        return promessa;
    };

    editItemFromMainTable(billUpdate: BillRegisterRequest): Promise<GenericResponse> {
        const promessa = new Promise<GenericResponse>((resolve, reject) => {

            this.http.put(EDIT_ITEM_MAIN_TABLE, billUpdate, { responseType: 'json' }).subscribe({
                next: (result: GenericResponse) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                },
            });
        });
        return promessa;
    };

    editItemFromCardTable(billUpdate: BillRegisterRequest): Promise<GenericResponse> {
        const promessa = new Promise<GenericResponse>((resolve, reject) => {
            this.http.put(EDIT_ITEM_CARD_TABLE, billUpdate, { responseType: 'json' }).subscribe({
                next: (result: GenericResponse) => {
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