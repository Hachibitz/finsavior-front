// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const URL_BASE_DEV = 'http://localhost:8085'

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const USER_SERVICE = "/users";
export const BILL_SERVICE = "/bills";
export const AUTH_SERVICE = "/auth"

export const SERVICE_LOGIN = URL_BASE_DEV + AUTH_SERVICE + '/login-auth';
export const SIGNUP_SERVICE = URL_BASE_DEV + AUTH_SERVICE + '/signup';
export const VALIDATE_TOKEN_SERVICE = URL_BASE_DEV + AUTH_SERVICE + '/validate-token';
export const DELETE_ACCOUNT_AND_DATA = URL_BASE_DEV + USER_SERVICE + '/delete-account';
export const MAIN_SERVICE_BILL_REGISTER = URL_BASE_DEV + BILL_SERVICE + '/bill-register';
export const LOAD_MAIN_TABLE_DATA = URL_BASE_DEV + BILL_SERVICE + '/load-main-table-data';
export const LOAD_CARD_TABLE_DATA = URL_BASE_DEV + BILL_SERVICE + '/load-card-table-data';
export const DELETE_ITEM_MAIN_TABLE = URL_BASE_DEV + BILL_SERVICE + '/delete-item-table-main';
export const DELETE_ITEM_CARD_TABLE = URL_BASE_DEV + BILL_SERVICE + '/delete-item-table-card';
export const EDIT_ITEM_MAIN_TABLE = URL_BASE_DEV + BILL_SERVICE + '/edit-item-table-main';
export const EDIT_ITEM_CARD_TABLE = URL_BASE_DEV + BILL_SERVICE + '/edit-item-table-card';