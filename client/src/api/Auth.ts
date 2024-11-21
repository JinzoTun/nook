import {API} from "../config/server";
import {newUser} from "../interfaces/interfaces";
import axios from "axios";

export interface LoginResponse {
    token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await axios.post<LoginResponse>(`${API}/api/auth/login`, { email, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export async function register(user: newUser): Promise<LoginResponse> {
    try {
        const response = await axios.post<LoginResponse>(`${API}/api/auth/register`, user);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
}

export async function logout(token: string): Promise<void> {
    try {
        await axios.post(`${API}/api/auth/logout`, {}, {
            headers: {
                token: token
            }
        });
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}


