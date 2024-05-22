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
export const AUTH_SERVICE = "/auth";
export const AI_ADVICE_SERVICE = "/ai-advice";

export const SERVICE_LOGIN = URL_BASE_DEV + AUTH_SERVICE + '/login-auth';
export const SIGNUP_SERVICE = URL_BASE_DEV + AUTH_SERVICE + '/signup';
export const VALIDATE_TOKEN_SERVICE = URL_BASE_DEV + AUTH_SERVICE + '/validate-token';
export const DELETE_ACCOUNT_AND_DATA = URL_BASE_DEV + USER_SERVICE + '/delete-account';
export const CHANGE_ACCOUNT_PASSWORD = URL_BASE_DEV + USER_SERVICE + '/change-password';
export const USER_PROFILE = URL_BASE_DEV + USER_SERVICE + '/profile-data';
export const GET_PROFILE_DATA = URL_BASE_DEV + USER_SERVICE + '/get-profile-data';
export const BILLS_SERVICE_BILL_REGISTER = URL_BASE_DEV + BILL_SERVICE + '/bill-register';
export const LOAD_MAIN_TABLE_DATA = URL_BASE_DEV + BILL_SERVICE + '/load-main-table-data';
export const LOAD_CARD_TABLE_DATA = URL_BASE_DEV + BILL_SERVICE + '/load-card-table-data';
export const DELETE_ITEM_MAIN_TABLE = URL_BASE_DEV + BILL_SERVICE + '/delete-item-table-main';
export const DELETE_ITEM_CARD_TABLE = URL_BASE_DEV + BILL_SERVICE + '/delete-item-table-card';
export const EDIT_ITEM_MAIN_TABLE = URL_BASE_DEV + BILL_SERVICE + '/edit-item-table-main';
export const EDIT_ITEM_CARD_TABLE = URL_BASE_DEV + BILL_SERVICE + '/edit-item-table-card';
export const GENERATE_AI_ADVICE = URL_BASE_DEV + AI_ADVICE_SERVICE + '/generate-ai-advice-and-insights';
export const GET_AI_ADVICE = URL_BASE_DEV + AI_ADVICE_SERVICE + '/get-ai-advice-and-insights';

export const AI_PROMPT = ["Considere as informações das minhas finanças do mês anterior abaixo:\nLevando em consideração os dados das tabelas abaixo: \n", "E os dados da tabela de cartão de crédito que detalha o valor do registro 'Cartão de crédito' da tabela anterior: \n", "E as legendas de cada tipo de conta:\n* Ativo: Direito ou valor que ficará disponível para ser encorporado à liquidez no futuro, exemplo: vale-alimentação, pagamento de empréstimo a receber, restituição de imposto, etc...\n* Passivo: Obrigação ou valor a diminuir da liquidez, exemplo: aluguel, parcela de carro, iptu, etc...\n* Caixa: Representa a injeção de valor valor imediato e disponível na liquidez, por exemplo: saldo de conta em banco.\n *Liquidez: Representa o seu estado financeiro atual: Liquidez=(Ativo+Caixa)-Passivo.\n\n", "Quais são suas considerações sobre minhas finanças? Está tudo bem? Tenho muitos gastos com algo que não deveria? Tem qualquer observação que me ajude sobre as minhas finanças? Estou fazendo algo certo? Se não estou bem financeiramente, o que você sugere de mudanças ou cortes? Como posso me organizar para poupar o máximo de dinheiro possível mensalmente? Qualquer dica ou insight que você tenha para me ajudar com esse assunto é bem vinda."];