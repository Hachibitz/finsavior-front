export interface LoginRequest {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface SignUpRequest {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirmation: string;
    agreement: boolean;
}

export interface SignUpResponse {
    message: string;
}

export interface DeleteAccountAndDataRequest {
    username: string;
    password: string;
    confirmation: boolean;
}

export interface DeleteAccountAndDataResponse {
    message: string;
}

export interface ChangeAccountPasswordRequest {
    username: string;
    currentPassword: string;
    newPassword: string;
}