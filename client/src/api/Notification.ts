import axios from "axios";
import { Notification } from "../interfaces/interfaces";
import { API } from "../config/server";

export const getNotifications = async ( token: string): Promise<Notification[]> => {
    const response = await axios.get(`${API}/api/users/notifications`, {
        headers: { token },
    });
    console.log(response.data);
    return response.data;
    
}

