import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * A custom hook to simulate a text streaming effect on the frontend.
 * @param streamSpeed - The delay in milliseconds between each word.
 * @returns An object with the displayed text and a function to start the effect.
 */
export const useSimulatedStream = (fullText: string, streamSpeed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!fullText) {
      setDisplayedText('');
      setIsStreaming(false);
      return;
    }

    // Stop any existing stream
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setDisplayedText(''); // Reset the text
    setIsStreaming(true);

    const words = fullText.split(' ');
    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        const word = words[currentIndex];
        if (word !== undefined) {
          setDisplayedText((prev) => prev + (currentIndex > 0 ? ' ' : '') + word);
        }
        currentIndex++;
      } else {
        // When done, clear the interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          setIsStreaming(false);
        }
      }
    }, streamSpeed);

  }, [fullText, streamSpeed]);

  // Cleanup function to clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { displayedText, isStreaming, start };
};
