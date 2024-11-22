import axios from "axios";
import { Den, User } from "@/interfaces/interfaces";
import { API } from "@/config/server";


// todo : need to better implement or remove it
export async function getJoinedDens ( token: string ) {
    try {
        const response = await axios.get<Den[]>(`${API}/api/users/dens`,{
            headers: {
                token: token
            }
        });
        // save the response data locally
        localStorage.setItem('dens', JSON.stringify(response.data));


        return response.data;
    } catch (error) {
        console.error("Error getting joined dens:", error);
        throw error;
    }
}

export async function fetchUser( token: string): Promise<User> {
  try {
    const response = await axios.get(`${API}/api/users/profile`, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user. Please try again later.");
  }
}

export async function updateUser(
  token: string,
  user: Partial<User>
): Promise<User> {
  try {
    const response = await axios.put(`${API}/api/users/profile`, user, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user. Please try again later.');
  }
}

// fetch user by id passed as parameter
export async function fetchUserById(id: string): Promise<User> {
  try {
    const response = await axios.get(`${API}/api/users/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw new Error('Failed to fetch user. Please try again later.');
  }
}