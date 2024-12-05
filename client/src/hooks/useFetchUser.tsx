import { useEffect, useState } from 'react';
import { fetchUserById } from '../api/User';
import { User } from "../interfaces/interfaces";

export const useFetchUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const data = await fetchUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
