export interface AuthUser {
    email: string;
    password: string;
}

export interface ResetEmail {
    email:string;
}

export interface ResetPassword {
    password: string;
    repeatedPassword: string;
}