import axios from "axios";

interface densProps {
    _id: string;
    name: string;
    description: string;
    categories: string;
    avatar?: string;
    banner?: string;
    members: string[];



}

async function getJoinedDens ( token: string ) {
    try {
        const response = await axios.get<densProps[]>('http://localhost:3000/api/users/dens',{
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

export default getJoinedDens;
   