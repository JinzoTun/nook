import axios from "axios";
import { Den } from "@/interfaces/interfaces";
import { API } from "@/config/server";

export async function JoinDen(denId: string, token: string) {
    try {
        const response = await axios.post(
            `${API}/api/dens/${denId}/join`,
            {},
            {
                headers: {
                    token
                }
            }
        );
        return response.data; // Return response data for further handling
    } catch (error) {
        console.error("Error joining den:", error);
        throw error; // Rethrow error for the caller to handle
    }
}

export async function LeaveDen(denId: string, token: string) {
    try {
        const response = await axios.post(
            `${API}/api/dens/${denId}/leave`,
            {},
            {
                headers: {
                    token
                }
            }
        );
        return response.data; // Return response data for further handling
    } catch (error) {
        console.error("Error leaving den:", error);
        throw error; // Rethrow error for the caller to handle
    }
}

export async function CreateDen(den: Den, token: string) {
    try {
        const response = await axios.post(
            `${API}/api/dens`,
            den,
            {
                headers: {
                    token
                }
            }
        );
        return response.data; // Return response data for further handling
    } catch (error) {
        console.error("Error creating den:", error);
        throw error; // Rethrow error for the caller to handle
    }
}

export async function getDens() {
    try {
        const response = await axios.get<Den[]>(`${API}/api/dens`);
        return response.data;
    } catch (error) {
        console.error("Error getting dens:", error);
        throw error;
    }
}

export async function getDenById(id: string) {
    try {
        const response = await axios.get<Den>(`${API}/api/dens/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error getting den by id:", error);
        throw error;
    }
}