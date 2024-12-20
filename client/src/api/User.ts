import axios from "axios";
import { Den, User } from "@/interfaces/interfaces";
import { API } from "@/config/server";

// Fetch joined dens
export async function getJoinedDens(token: string) {
  try {
    const response = await axios.get<Den[]>(`${API}/api/users/dens`, {
      headers: {
        token: token,
      },
    });
    // save the response data locally
    localStorage.setItem("dens", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error getting joined dens:", error);
    throw error;
  }
}

// Fetch user
export async function fetchUser(token: string): Promise<User> {
  try {
    const response = await axios.get(`${API}/api/users/profile`, {
      headers: { token: token },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user. Please try again later.");
  }
}

// Update user
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
    console.error("Error updating user:", error);
    throw new Error("Failed to update user. Please try again later.");
  }
}

// Fetch user by id (no token required)
export async function fetchUserById(id: string): Promise<User> {
  try {
    const response = await axios.get(`${API}/api/users/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw new Error("Failed to fetch user. Please try again later.");
  }
}

// Update user avatar
export async function updateUserAvatar(token: string, avatar: File) {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await axios.put(`${API}/api/users/profile`, formData, {
      headers: { token, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user avatar:", error);
    throw new Error("Failed to update user avatar. Please try again later.");
  }
}

// Update user banner
export async function updateUserBanner(token: string, banner: File) {
  try {
    const formData = new FormData();
    formData.append("banner", banner);
    const response = await axios.put(`${API}/api/users/profile`, formData, {
      headers: { token, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user banner:", error);
    throw new Error("Failed to update user banner. Please try again later.");
  }
}

// Follow user
export async function followUser(targetUserId: string, token: string): Promise<void> {
  try {
    await axios.put(
      `${API}/api/users/follow/${targetUserId}`,
      {},
      { headers: { token } }
    );
  } catch (error) {
    console.error("Error following user:", error);
    throw new Error("Failed to follow user. Please try again later.");
  }
}

// Unfollow user
export async function unfollowUser(targetUserId: string, token: string): Promise<void> {
  try {
    await axios.put(
      `${API}/api/users/unfollow/${targetUserId}`,
      {},
      { headers: { token } }
    );
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw new Error("Failed to unfollow user. Please try again later.");
  }
}
