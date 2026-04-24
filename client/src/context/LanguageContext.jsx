import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Translations object
const translations = {
  english: {
    home: 'Home',
    poochna: 'Poochna',
    seekhna: 'Seekhna',
    community: 'Community',
    about: 'About',
    search: 'Search',
    ask: 'Ask',
    learn: 'Learn',
    loading: 'Loading...',
    error: 'Something went wrong',
    noResults: 'No results found',
    tryAgain: 'Try again',
    viewAll: 'View All',
    startLearning: 'Start Learning',
    markComplete: 'Mark as Complete',
    completed: 'Completed',
    steps: 'Steps',
    minutes: 'min',
    difficulty: 'Difficulty',
    prerequisites: 'Prerequisites',
    related: 'Related Tutorials',
    searchPlaceholder: 'Type your question here — Urdu, Roman Urdu, or English...',
    trendingThisWeek: 'Trending This Week',
    popularQuestions: 'Popular Questions',
    safetyWarning: 'Asaan Digital 2.0 will never ask for your bank passwords or OTP.',
  },
  urdu: {
    home: 'ہوم',
    poochna: 'پوچھنا',
    seekhna: 'سیکھنا',
    community: 'کمیونٹی',
    about: 'ہمارے بارے میں',
    search: 'تلاش',
    ask: 'پوچھیں',
    learn: 'سیکھیں',
    loading: 'لوڈ ہو رہا ہے...',
    error: 'کچھ غلط ہو گیا',
    noResults: 'کوئی نتیجہ نہیں ملا',
    tryAgain: 'دوبارہ کوشش کریں',
    viewAll: 'سب دیکھیں',
    startLearning: 'سیکھنا شروع کریں',
    markComplete: 'مکمل کریں',
    completed: 'مکمل',
    steps: 'مراحل',
    minutes: 'منٹ',
    difficulty: 'مشکل',
    prerequisites: 'ضروری اقدامات',
    related: 'متعلقہ سبق',
    searchPlaceholder: 'اپنا سوال یہاں لکھیں — اردو، رومن اردو، یا انگریزی...',
    trendingThisWeek: 'اس ہفتے کے مقبول موضوعات',
    popularQuestions: 'مقبول سوالات',
    safetyWarning: 'آسان ڈیجیٹل 2.0 کبھی بھی آپ کا بینک پاسورڈ یا OTP نہیں مانگے گا۔',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'english';
  });

  // Persist language preference
  useEffect(() => {
    localStorage.setItem('language', language);
    // Set document direction for Urdu
    document.documentElement.dir = language === 'urdu' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'urdu' ? 'ur' : 'en';
  }, [language]);

  /**
   * Toggle between languages
   */
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'english' ? 'urdu' : 'english');
  }, []);

  /**
   * Set specific language
   */
  const changeLanguage = useCallback((lang) => {
    if (lang === 'english' || lang === 'urdu') {
      setLanguage(lang);
    }
  }, []);

  /**
   * Translate a key
   */
  const t = useCallback((key) => {
    return translations[language]?.[key] || translations.english[key] || key;
  }, [language]);

  const value = {
    language,
    toggleLanguage,
    changeLanguage,
    t,
    translations: translations[language],
    isUrdu: language === 'urdu',
    isEnglish: language === 'english',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;