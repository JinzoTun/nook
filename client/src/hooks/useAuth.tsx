
import { useEffect, useState } from 'react';
import { fetchUser } from '../api/User';


export const useAuth = () => {
    const token = localStorage.getItem('token');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
    useEffect(() => {
      if (token) {
        fetchUser(token)
          .then((user) => setCurrentUserId(user._id))
          .catch(() => setCurrentUserId(null));
      }
    }, [token]);
  
    return { token, currentUserId };
  };
  