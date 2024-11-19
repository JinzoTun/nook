import axios from "axios";

async function JoinDen(denId: string, token: string) {
    try {
        const response = await axios.post(
            `http://localhost:3000/api/dens/${denId}/join`,
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

export default JoinDen;