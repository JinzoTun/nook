import axios from "axios";
import { Den } from "@/interfaces/interfaces";
import { API } from "@/config/server";

export async function JoinDen(denId: string, token: string) {
    try {
        const response = await axios.post(
            `${API}/api/join-den/${denId}`,
            {},
            {
                headers: {
                    token : token
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
            `${API}/api/leave-den/${denId}`,
            {},
            {
                headers: {
                    token : token
                }
            }
        );
        return response.data; // Return response data for further handling
    } catch (error) {
        console.error("Error leaving den:", error);
        throw error; // Rethrow error for the caller to handle
    }
}


export async function CreateDen(den: Partial<Den>, token: string, avatar?: File, banner?: File) {
    try {
        const formData = new FormData();
        formData.append("name", den.name || "");
        formData.append("description", den.description || "");
        formData.append("categories",  den.categories || "");
        formData.append("visibility", den.visibility || "");
        if (avatar) {
            formData.append("avatar", avatar);
        }
        if (banner) {
            formData.append("banner", banner);
        }

        const response = await axios.post(`${API}/api/create-den`, formData, {
            headers: {
                token: token,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating den:", error);
        throw error;
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
        const response = await axios.get<Den>(`${API}/api/den/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error getting den by id:", error);
        throw error;
    }
}

// updateDenById function
export async function updateDenById(id: string, den: Partial<Den>, token: string, avatar?: File, banner?: File) {
    try {
        const formData = new FormData();
        formData.append("name", den.name || "");
        formData.append("description", den.description || "");
        formData.append("categories", den.categories || "");
        formData.append("visibility", den.visibility || "");
        if (avatar) {
            formData.append("avatar", avatar);
        }
        if (banner) {
            formData.append("banner", banner);
        }

        const response = await axios.put(`${API}/api/update-den/${id}`, formData, {
            headers: {
                token: token,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating den:", error);
        throw error;
    }
}