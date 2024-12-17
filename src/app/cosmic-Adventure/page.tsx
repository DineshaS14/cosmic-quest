'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Game from '@/components/Game';

const Home: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const router = useRouter(); // Next.js router

  const handleBack = () => {
    if (!isGameStarted) {
      router.push('/'); // Navigate to /cosmic-Adventure/page.tsx
    }
    setIsGameStarted(false); // Reset game state
    router.push('/cosmic-Adventure')
  };

  return (
    <div className="">
      {/* Main Container */}
      <button
              onClick={handleBack}
              className="absolute top-2 left-2 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition duration-300 z-10"
            >
              Back
         </button>
      <div className="">
        {/* Opening Screen */}
        {!isGameStarted && (
          <div className='flex items-center justify-center h-screen bg-black'>
            {/* Background Image */}
            <div className='relative w-[500px] h-[500px] border border-gray-600 overflow-hidden'>
            <Image
              src="/images/openingGameScreen.png"
              alt="Opening Game Screen"
              layout="fill"
              objectFit="cover"
              priority
              className="rounded-md"
            />
            {/* Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                onClick={() => setIsGameStarted(true)}
                className="px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-md hover:bg-green-700 transition duration-300"
              >
                Play
              </button>
            </div>
            </div>
          </div>
        )}

        {/* Game Screen */}
        {isGameStarted && (
          <div className="relative w-full h-full">
            {/* Back Button */}
           
            {/* Game Component */}
            <Game />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;