"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey } from '../i18n/translations';

type LanguageContextType = {
 language: 'en' | 'vi';
 setLanguage: (lang: 'en' | 'vi') => void;
 toggleLanguage: () => void;
 t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
 const [language, setLanguage] = useState<'en' | 'vi'>('en');
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 const stored = localStorage.getItem('brandflow-lang') as 'en' | 'vi';
 if (stored && (stored === 'en' || stored === 'vi')) {
 setLanguage(stored);
 }
 }, []);

 const changeLanguage = (lang: 'en' | 'vi') => {
 setLanguage(lang);
 if (typeof window !== 'undefined') {
 localStorage.setItem('brandflow-lang', lang);
 }
 };

 const toggleLanguage = () => {
 changeLanguage(language === 'en' ? 'vi' : 'en');
 };

 const t = (key: TranslationKey): string => {
 const keys = key.split('.');
 let cur: any = translations;
 for (const k of keys) {
 if (cur[k] === undefined) return key;
 cur = cur[k];
 }
 if (cur && cur[language] !== undefined) {
 return cur[language];
 }
 // Fallback to en if vi is missing
 if (cur && cur['en'] !== undefined) {
 return cur['en'];
 }
 return key;
 };

 return (
 <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage, t }}>
 <div className="contents" style={{ visibility: mounted ? 'visible' : 'hidden' }}>
 {children}
 </div>
 </LanguageContext.Provider>
 );
}

export function useLanguage() {
 const context = useContext(LanguageContext);
 if (context === undefined) {
 throw new Error('useLanguage must be used within a LanguageProvider');
 }
 return context;
}
