export type User = {
    id : string;
    displayName: string;
    token : string;
    email : string; 
    imageUrl? : string;
}
export type LoginCrds ={
    email: string;
    password: string;
}
export type RegisterCreds = {
    email: string;
    password: string;
    displayName: string;
}