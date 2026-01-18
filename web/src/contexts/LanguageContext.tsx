import { createContext } from 'react';

export interface LanguageContextType {
    getLang: (key: string, fallback?: string) => string;
    isTranslationExists: (key: string) => boolean;
    getLanguages: () => Record<string, string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
