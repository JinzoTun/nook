import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card'; // ShadCN Card
import { Button } from './ui/button'; // ShadCN Button
import { getDens, JoinDen } from '@/api/Den';
import { getJoinedDens } from '@/api/User';
import { Den } from '@/interfaces/interfaces';
import { Loading } from './ui/Loading';

const AllDens: React.FC = () => {
  const [dens, setDens] = useState<Den[]>([]);
  const [joinedDens, setJoinedDens] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDens = async () => {
      try {
        const dens = await getDens();
        setDens(dens);
      } catch (err) {
        setError((err as Error).message || 'Failed to load dens.');
      } finally {
        setLoading(false);
      }
    };

    const loadJoinedDens = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not authenticated');
        const joinedDens = await getJoinedDens(token);
        setJoinedDens(new Set(joinedDens.map((den) => den._id)));
      } catch (err) {
        console.error('Error fetching joined dens:', err);
      }
    };

    loadDens();
    loadJoinedDens();
  }, []);

  const handleNavigateToDen = (denId: string) => {
    window.location.href = `/d/${denId}`;
  };

  const handleJoinDen = async (denId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      await JoinDen(denId, token);
      setJoinedDens(new Set([...joinedDens, denId]));
    } catch (err) {
      console.error('Error joining den:', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  if (!dens || dens.length == 0 ) return <p className="text-center text-gray-600">No Dens available</p>;

  return (
    <>
      {/* Back Button */}
      <div className="flex items-center mb-5 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => window.history.back()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="text-lg font-bold">Home</span>
      </div>

      {/* Dens Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dens.length > 0 ? (
          dens.map((den) => (
            <Card
              key={den._id}
              onClick={() => handleNavigateToDen(den._id)}
              className="flex flex-col items-center justify-between p-4 shadow-md hover:shadow-lg transition-all rounded-lg hover:cursor-pointer"
            >
              {/* Avatar */}
              <CardHeader className="flex flex-col items-center">
                <img
                  src={den.avatar || 'https://via.placeholder.com/80'}
                  alt={den.name}
                  className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-gray-300"
                />
                <h2 className="text-lg font-semibold">d/{den.name}</h2>
              </CardHeader>

              {/* Description */}
              <CardContent className="text-center">
                <p className="text-sm">
                  {den.categories || 'No description available.'}
                </p>
              </CardContent>

              {/* Join Button */}
              <CardFooter className="mt-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinDen(den._id);
                  }}
                  disabled={joinedDens.has(den._id)}
                  className="w-full py-2 rounded-lg"
                >
                  {joinedDens.has(den._id) ? 'Joined' : 'Join'}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No Dens available</p>
        )}
      </div>
    </>
  );
};

export default AllDens;
