"use client";

import React, { useEffect, useState } from 'react';

const heartEmojis = ['💖', '💘', '💞', '💕', '💓', '💗', '💝', '😍', '😘'];

interface Heart {
  id: number;
  emoji: string;
  x: number;
  duration: number;
  delay: number;
  size: number;
}

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // This effect runs only once on mount on the client-side
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      for (let i = 0; i < 20; i++) { // Number of hearts
        newHearts.push({
          id: Math.random(), // Using Math.random for key is okay for this simple case
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
          x: Math.random() * 100, // percentage for left style
          duration: Math.random() * 5 + 3, // 3s to 8s
          delay: Math.random() * 5, // 0s to 5s delay
          size: Math.random() * 1.5 + 1, // 1rem to 2.5rem
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, []); // Empty dependency array ensures this runs once on mount (client-side)


  if (hearts.length === 0) return null; // Don't render anything until hearts are generated

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-particle"
          style={{
            left: `${heart.x}%`,
            fontSize: `${heart.size}rem`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
          aria-hidden="true"
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
