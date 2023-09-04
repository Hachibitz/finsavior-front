export interface TipoConta {
    label: string;
    value: string;
}

export interface SelectedMonth {
    label: string;
    value: string;
}

export interface BillRegisterRequest {
    billDate: string;
    billType: string;
    billName: string;
    billValue: number;
    billDescription: string;
    billTable: string;
}