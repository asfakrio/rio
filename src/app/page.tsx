
"use client";

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FloatingHearts from '@/components/floating-hearts';

const yesButtonTexts = ["Yes 💖", "Really? 🥰", "You sure? 😍", "Go on... 😘", "Absolutely! 🎉"];
const noButtonTexts = [
  "No 😢", 
  "Not a chance! 🤪", 
  "Try again! 🤣", 
  "Catch me! 😉", 
  "Nope! 😂",
  "Are you kidding? 🤨",
  "Dream on! 😴",
  "Too slow! 💨",
  "Missed me! 😜",
  "In your dreams! 💭",
  "Seriously? 🙄",
  "As if! 💅",
  "Zip Zap Zoom! ⚡️",
  "Can't touch this! 🕺",
  "Way too easy! 😎"
];

const celebratoryGifUrl = "https://media1.tenor.com/m/Dp9JlqQDuHUAAAAd/pentol-stiker.gif";

export default function LoveDodgerPage() {
  const [showInitialElements, setShowInitialElements] = useState(true);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: string; left: string } | null>(null);
  const [noButtonIsDodging, setNoButtonIsDodging] = useState(false);
  
  const [currentYesTextIndex, setCurrentYesTextIndex] = useState(0);
  const [currentNoTextIndex, setCurrentNoTextIndex] = useState(0);

  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isYesClicked) {
      document.body.classList.add('celebration-bg');
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.log("Autoplay prevented: ", error));
      }
    }
    return () => {
      document.body.classList.remove('celebration-bg');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to beginning
      }
    };
  }, [isYesClicked]);

  const handleNoButtonAction = (event: MouseEvent<HTMLButtonElement>) => {
    if (!noButtonIsDodging) {
      setNoButtonIsDodging(true); 
    }
    setCurrentNoTextIndex((prevIndex) => (prevIndex + 1) % noButtonTexts.length);

    const button = event.currentTarget;
    if (button && typeof window !== 'undefined') {
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;
      
      const maxX = window.innerWidth - buttonWidth - 20; 
      const maxY = window.innerHeight - buttonHeight - 20;

      const newX = Math.max(10, Math.floor(Math.random() * maxX));
      const newY = Math.max(10, Math.floor(Math.random() * maxY));
      
      setNoButtonPosition({ top: `${newY}px`, left: `${newX}px` });
    }
  };

  const handleYesButtonMouseEnter = () => {
    setCurrentYesTextIndex((prevIndex) => (prevIndex + 1) % yesButtonTexts.length);
  };

  const handleYesButtonClick = () => {
    setShowInitialElements(false);
    setIsYesClicked(true);
  };
  
  const noButtonStyle: React.CSSProperties = noButtonIsDodging && noButtonPosition
  ? {
      position: 'fixed',
      top: noButtonPosition.top,
      left: noButtonPosition.left,
      transition: 'top 0.15s ease-out, left 0.15s ease-out',
      zIndex: 50,
    }
  : {
      position: 'relative',
    };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-screen p-4 text-center relative overflow-hidden">
      
      {isYesClicked && <FloatingHearts />}

      {/* 
        Music Player Instructions:
        1. Create an 'audio' folder in your 'public' directory. 
           (e.g., your-project-folder/public/audio/).
        2. Add your music file (named 'music.mp3') to this 'public/audio/' folder.
        The audio will autoplay and loop in the background when 'Yes' is clicked.
        There will be no visible player controls.
      */}
      <audio ref={audioRef} loop className="hidden">
        {/* Ensure 'music.mp3' is in your 'public/audio/' folder! */}
        <source src="/audio/music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {showInitialElements && (
        <>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 font-playful text-primary animate-pulse">
            Khushi, do you love Rio? 🥺
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              onClick={handleYesButtonClick}
              onMouseEnter={handleYesButtonMouseEnter}
              size="lg"
              className="px-8 py-4 text-xl md:text-2xl font-playful transform hover:scale-150 active:scale-125 transition-transform duration-700 ease-out shadow-lg hover:shadow-xl"
              aria-label="Yes, I love you"
            >
              {yesButtonTexts[currentYesTextIndex]}
            </Button>
            <Button
              ref={noButtonRef}
              onMouseEnter={handleNoButtonAction}
              onClick={handleNoButtonAction} 
              size="lg"
              variant="secondary" 
              className="px-8 py-4 text-xl md:text-2xl font-playful shadow-md hover:shadow-lg"
              style={noButtonStyle}
              aria-label="No, I do not love you"
            >
              {noButtonTexts[currentNoTextIndex]}
            </Button>
          </div>
        </>
      )}

      {isYesClicked && (
        <div className="flex flex-col items-center justify-center mt-10 p-6 bg-card/80 backdrop-blur-sm rounded-xl shadow-2xl max-w-md z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playful text-accent animate-bounce">
            Yeeeaaaashh! What a feeling! 🎉💖✨
          </h2>
          <div className="mt-4">
            <Image
              src={celebratoryGifUrl}
              alt="Celebratory GIF - Pentol Sticker"
              width={250}
              height={250}
              unoptimized={true} 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
       <footer className="absolute bottom-4 text-center w-full text-xs text-muted-foreground/80 z-10 font-playful">
        Crafted with love & a sprinkle of mischief by Rio for Khushi!
      </footer>
    </div>
  );
}

