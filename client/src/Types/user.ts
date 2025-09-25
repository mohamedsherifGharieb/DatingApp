export type User = {
    id : string;
    displayName: string;
    token : string;
    email : string; 
    imageUrl? : string;
    roles: string[];
}
export type LoginCreds ={
    email: string;
    password: string;
}
export type RegisterCreds = {
    email: string;
    password: string;
    displayName: string;
    gender: string;
    dateOfBirth:string;
    city:string;
    country:string;
}