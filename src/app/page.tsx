
"use client";

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FloatingHearts from '@/components/floating-hearts';
import { generateAffirmation } from '@/ai/flows/personalized-affirmation';

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

  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [isLoadingAffirmation, setIsLoadingAffirmation] = useState(false);
  const [affirmationError, setAffirmationError] = useState<string | null>(null);


  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isYesClicked) {
      document.body.classList.add('celebration-bg');
      setIsLoadingAffirmation(true);
      setAffirmationError(null);
      generateAffirmation({ userName: 'Khushi' })
        .then(response => {
          setAffirmation(response.affirmationMessage);
        })
        .catch(error => {
          console.error("Error generating affirmation:", error);
          setAffirmationError("Couldn't get a special message, but my love is clear! ❤️");
        })
        .finally(() => {
          setIsLoadingAffirmation(false);
        });
      
      if (audioRef.current) {
        // Optional: You could change the music or stop it here
      }
    }
    return () => {
      document.body.classList.remove('celebration-bg');
    };
  }, [isYesClicked]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio autoplay was prevented:", error);
      });
    }
  }, []);

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
      <audio ref={audioRef} src="/music/perfect-ed-sheeran.mp3" loop autoPlay className="absolute top-4 left-4 z-50 opacity-50 hover:opacity-100 transition-opacity"/>
      
      {isYesClicked && <FloatingHearts />}

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
            🎉 Khushi loves Rio!!! ❤️ ✨
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
          {isLoadingAffirmation && (
            <p className="mt-4 text-lg font-playful text-muted-foreground">💖 Getting a special message for you... ✨</p>
          )}
          {affirmationError && (
             <p className="mt-4 text-lg font-playful text-destructive">{affirmationError}</p>
          )}
          {affirmation && !isLoadingAffirmation && !affirmationError && (
            <p className="mt-4 text-lg font-playful text-foreground leading-relaxed">{affirmation}</p>
          )}
        </div>
      )}
       <footer className="absolute bottom-4 text-center w-full text-xs text-muted-foreground/80 z-10 font-playful">
        Crafted with love & a sprinkle of mischief by Rio for Khushi!
      </footer>
    </div>
  );
}

