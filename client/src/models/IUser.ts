export interface IUser {
    _id: string;
    username: string;
    email: string;
    registrationDate: Date;
    lastLogin: Date;
    status: string;
}