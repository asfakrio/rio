"use client";

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { generateAffirmation } from '@/ai/flows/personalized-affirmation';
import FloatingHearts from '@/components/floating-hearts';

export default function LoveDodgerPage() {
  const [showInitialElements, setShowInitialElements] = useState(true);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: string; left: string } | null>(null);
  const [noButtonIsDodging, setNoButtonIsDodging] = useState(false);
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [isLoadingAffirmation, setIsLoadingAffirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for elements if needed, e.g., for complex positioning logic or focusing
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // To contain button movement if not viewport-wide

  useEffect(() => {
    if (isYesClicked) {
      document.body.classList.add('celebration-bg');
    }
    return () => {
      document.body.classList.remove('celebration-bg');
    };
  }, [isYesClicked]);

  const handleNoButtonAction = (event: MouseEvent<HTMLButtonElement>) => {
    if (!noButtonIsDodging) {
      setNoButtonIsDodging(true); 
    }

    const button = event.currentTarget;
    if (button && typeof window !== 'undefined') { // Ensure window is defined (client-side)
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;
      
      const maxX = window.innerWidth - buttonWidth - 20; 
      const maxY = window.innerHeight - buttonHeight - 20;

      const newX = Math.max(10, Math.floor(Math.random() * maxX));
      const newY = Math.max(10, Math.floor(Math.random() * maxY));
      
      setNoButtonPosition({ top: `${newY}px`, left: `${newX}px` });
    }
  };

  const handleYesButtonClick = async () => {
    setShowInitialElements(false);
    setIsYesClicked(true);
    setIsLoadingAffirmation(true);
    setError(null);
    try {
      const result = await generateAffirmation({ userName: "My Dearest" });
      setAffirmation(result.affirmationMessage);
    } catch (e) {
      console.error("Failed to generate affirmation:", e);
      setError("My heart's aflutter and missed a beat with the message! But know this: I adore you! ❤️");
      setAffirmation(null);
    } finally {
      setIsLoadingAffirmation(false);
    }
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

      {showInitialElements && (
        <>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 font-playful text-primary animate-pulse">
            Do you love me? 🥺
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              onClick={handleYesButtonClick}
              size="lg"
              className="px-8 py-4 text-xl md:text-2xl font-playful transform hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl"
              aria-label="Yes, I love you"
            >
              Yes 💖
            </Button>
            <Button
              ref={noButtonRef}
              onMouseEnter={handleNoButtonAction}
              onClick={handleNoButtonAction} // Also trigger move on click attempt
              size="lg"
              variant="secondary" // Uses the lavender theme for secondary
              className="px-8 py-4 text-xl md:text-2xl font-playful shadow-md hover:shadow-lg"
              style={noButtonStyle}
              aria-label="No, I do not love you"
            >
              No 😢
            </Button>
          </div>
        </>
      )}

      {isYesClicked && (
        <div className="mt-10 p-6 bg-card/90 backdrop-blur-sm rounded-xl shadow-2xl max-w-md z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playful text-accent">
            🎉 Yaaay!!! ✨
          </h2>
          {isLoadingAffirmation && (
            <div className="flex flex-col items-center text-lg text-foreground">
              <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
              <p className="font-playful">Crafting the perfect words for you...</p>
            </div>
          )}
          {affirmation && !isLoadingAffirmation && (
            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-playful whitespace-pre-wrap">
              {affirmation}
            </p>
          )}
          {error && !isLoadingAffirmation && (
             <p className="text-xl md:text-2xl text-destructive-foreground bg-destructive p-4 rounded-md leading-relaxed font-playful">
              {error}
            </p>
          )}
        </div>
      )}
       <footer className="absolute bottom-4 text-center w-full text-xs text-muted-foreground/80 z-10 font-playful">
        Crafted with love & a sprinkle of mischief!
      </footer>
    </div>
  );
}
