export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignUpRequest {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface SignUpResponse {
    message: string;
}