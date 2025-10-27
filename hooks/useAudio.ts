
import { useRef, useCallback, useEffect } from 'react';

export const useAudio = (url: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const newAudio = new Audio(url);
    newAudio.loop = true;
    audioRef.current = newAudio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [url]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(error => console.error("Audio play failed:", error));
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
};
