import { Language } from '../types';

export function speakText(text: string, lang: Language): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this environment');
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clear rural comprehension
      utterance.pitch = 1.0;

      // Select matching BCP 47 language code for Karnataka state
      const langCodes: Record<Language, string> = {
        kn: 'kn-IN',
        en: 'en-IN',
        hi: 'hi-IN',
      };

      utterance.lang = langCodes[lang] || 'en-IN';

      // Pick localized voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(
        (v) => v.lang.startsWith(langCodes[lang]) || v.lang.toLowerCase().includes(lang)
      );
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
      resolve();
    }
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
