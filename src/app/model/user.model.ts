import { AnalysisTypeEnum } from "./ai-advice.model";

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
    status: string;
    message: string;
}

export interface ChangeAccountPasswordRequest {
    username: string;
    currentPassword: string;
    newPassword: string;
}

export interface UserData {
    username: string;
    email: string;
    plan: Plan;
    profilePicture: ArrayBuffer;
}

export interface UploadProfilePictureRequest {
    name: string;
    profilePicture: File;
}

export interface Plan {
    planId: string;
    planDs: string;
}

export const PlanEnum: Plan[] = [
    { planId: '1L', planDs: 'FREE' },
    { planId: '2L', planDs: 'PLUS' },
    { planId: '3L', planDs: 'PREMIUM' }
]

export const PlanCoverageEnum = {
    FREE: { planId: '1L', coverages: [AnalysisTypeEnum.FREE]},
    PLUS: { planId: '2L', coverages: [AnalysisTypeEnum.FREE, AnalysisTypeEnum.TRIMESTER, AnalysisTypeEnum.ANNUAL]},
    PREMIUM: { planId: '3L', coverages: [AnalysisTypeEnum.FREE, AnalysisTypeEnum.TRIMESTER, AnalysisTypeEnum.ANNUAL] }
}