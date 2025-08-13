import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, lang: string = 'ja-JP') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }, []);

  const isSupported = 'speechSynthesis' in window;

  return { speak, isSupported };
}
