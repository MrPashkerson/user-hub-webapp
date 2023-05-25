import $api from "../http";
import {AxiosResponse} from "axios";
import {IUser} from "../models/IUser";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users');
    }

    static async deleteUsers(userIds: string[] = []): Promise<any> {
        return $api.post('/delete', { userIds });
    }

    static async blockUsers(userIds: string[] = []): Promise<any> {
        return $api.post('/block', { userIds });
    }

    static async unblockUsers(userIds: string[] = []): Promise<any> {
        return $api.post('/unblock', { userIds });
    }
}