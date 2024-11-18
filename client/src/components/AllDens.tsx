import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card'; // ShadCN Card
import { Button } from './ui/button'; // ShadCN Button

interface Den {
  _id: string;
  name: string;
  description: string;
  categories: string;
  avatar?: string; // Optional image for the den
}

const AllDens: React.FC = () => {
  const [dens, setDens] = useState<Den[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joinedDens, setJoinedDens] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDens = async () => {
      try {
        const response = await axios.get<Den[]>('http://localhost:3000/api/dens');
        setDens(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Error loading Dens' data: ${err}`);
        setLoading(false);
      }
    };
    fetchDens();
  }, []);

  const handleJoinDen = async (denId: string) => {
    try {
      const response
        = await axios.post(`http://localhost:3000/api/dens/${denId}/join`,{
          headers: {
            token: localStorage.getItem('token')
          }
        });
      if (response.status === 200) {
        setJoinedDens(new Set([...joinedDens, denId]));
      } else {
        console.error('Failed to join Den');
      }
    } catch (err) {
      console.error('Error joining Den :', err);
    }
    
  };

  if (loading) return <p className="text-center text-gray-600">Loading Dens...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
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
        <span className="text-lg font-bold ">Home</span>
      </div>

      {/* Dens Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dens.length > 0 ? (
          dens.map((den) => (
            <Card
              key={den._id}
              className="flex flex-col items-center justify-between p-4 shadow-md hover:shadow-lg transition-all rounded-lg"
            >
              {/* Avatar */}
              <CardHeader className="flex flex-col items-center">
                <img
                  src={den.avatar || 'https://via.placeholder.com/80'}
                  alt={den.name}
                  className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-gray-300"
                />
                <h2 className="text-lg font-semibold ">d/{den.name}</h2>
              </CardHeader>

              {/* Description */}
              <CardContent className="text-center">
                <p className="text-sm ">
                  {den.categories && den.categories.length > 0
                    ? den.categories
                    : 'No description available.'}
                </p>
              </CardContent>

              {/* Join Button */}
              <CardFooter className="mt-4">
                <Button
                  onClick={() => handleJoinDen(den._id)}
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
    </div>
  );
};

export default AllDens;
