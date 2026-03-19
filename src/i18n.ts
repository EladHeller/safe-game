export type TranslationKeys = {
  title: string;
  subtitle: string;
  ready: string;
  accessGranted: string;
  denied: string;
  safeBreached: string;
  jackpot: string;
  startBreach: string;
  tryAgain: string;
  continue: string;
  level: string;
  lives: string;
  gameOver: string;
  restart: string;
  missionComplete: string;
  victoryTitle: string;
  levelComplete: string;
  victoryMessage: string;
  continueMessage: string;
};

export const translations: { [key: string]: TranslationKeys } = {
  en: {
    title: 'THE VAULT HEIST',
    subtitle: 'A High-Stakes Memory Challenge',
    ready: 'SYSTEM READY',
    accessGranted: 'ACCESS GRANTED',
    denied: 'ACCESS DENIED',
    safeBreached: 'SAFE BREACHED!',
    jackpot: 'JACKPOT!',
    startBreach: 'START BREACH',
    tryAgain: 'TRY AGAIN',
    continue: 'CONTINUE',
    level: 'LEVEL',
    lives: 'LIVES',
    gameOver: 'GAME OVER',
    restart: 'RESTART MISSION',
    missionComplete: 'MISSION COMPLETE',
    victoryTitle: "YOU'RE A LEGEND!",
    levelComplete: "VAULT BREACHED!",
    victoryMessage: "You've cracked the World Reserve. The legends are true.",
    continueMessage: "Proceed to the next vault."
  },
  he: {
    title: 'שוד הכספות',
    subtitle: 'אתגר זיכרון בקנה מידה גדול',
    ready: 'המערכת מוכנה',
    accessGranted: 'גישה אושרה',
    denied: 'גישה נדחתה',
    safeBreached: 'הכספת נפרצה!',
    jackpot: 'זכית בקופה!',
    startBreach: 'התחל בפריצה',
    tryAgain: 'נסה שוב',
    continue: 'המשך',
    level: 'שלב',
    lives: 'חיים',
    gameOver: 'המשחק נגמר',
    restart: 'התחל משימה מחדש',
    missionComplete: 'המשימה הושלמה',
    victoryTitle: "אתה אגדה!",
    levelComplete: "הכספת נפרצה!",
    victoryMessage: "פרצת את הכספת העולמית. האגדות נכונות.",
    continueMessage: "המשך לכספת הבאה."
  },
};

export const getLanguage = (): 'en' | 'he' => {
    const lang = navigator.language.split('-')[0];
    return lang === 'he' ? 'he' : 'en';
};
