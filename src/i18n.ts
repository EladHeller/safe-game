export const translations = {
  en: {
    title: "SAFE BREAKER",
    subtitle: "MEMORIZE THE CODE • CRACK THE VAULT",
    ready: "READY",
    accessGranted: "ACCESS GRANTED",
    denied: "DENIED",
    safeBreached: "SAFE BREACHED",
    jackpot: "Jackpot secured",
    startBreach: "START BREACH",
    tryAgain: "TRY AGAIN",
    continue: "CONTINUE",
    level: "LEVEL",
    lives: "LIVES",
    gameOver: "VAULT LOCKED",
    restart: "RESTART MISSION",
    missionComplete: "MISSION COMPLETE!"
  },
  he: {
    title: "פורץ הכספות",
    subtitle: "זכור את הקוד • פרוץ את הכספת",
    ready: "מוכן",
    accessGranted: "גישה אושרה",
    denied: "הגישה נדחתה",
    safeBreached: "הכספת נפרצה",
    jackpot: "השלל בידינו",
    startBreach: "התחל פריצה",
    tryAgain: "נסה שוב",
    continue: "המשך",
    level: "שלב",
    lives: "חיים",
    gameOver: "הכספת ננעלה",
    restart: "התחל מחדש",
    missionComplete: "המשימה הושלמה!"
  }
};

export type Language = 'en' | 'he';
export type TranslationKeys = typeof translations.en;

export const getLanguage = (): Language => {
  const lang = navigator.language || (navigator as any).userLanguage;
  return lang.startsWith('he') ? 'he' : 'en';
};
