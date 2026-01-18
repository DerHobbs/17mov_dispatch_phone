import { type ReactNode, useState, useEffect, useCallback, useMemo } from 'react';

import { LanguageContext } from '@/contexts/LanguageContext';
import { useNuiCallback, useNuiEvent } from '@/hooks/useNui';

const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const settings = useSettings();

    const [languages, setLanguages] = useState<Record<string, string>>({});
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const [FetchLanguage] = useNuiCallback<{ lang: string }, Record<string, string>>('Core:GetLanguage');

    useNuiEvent<{ languages: Record<string, string>; defaultLang: string }>('Language:Initialize', (data) => {
        setLanguages(data.languages);
    });

    useNuiEvent<Record<string, string>>('Language:Set', (data) => {
        setTranslations({ ...data });
    });

    useEffect(() => {
        const fetchLanguage = async () => {
            const result = await FetchLanguage({
                lang: settings.language ?? 'en',
            });
            setTranslations({ ...result });
        };

        fetchLanguage();
    }, [FetchLanguage, settings.language]);

    const getLang = useCallback(
        (key: string, fallback?: string) => {
            return translations[key] ?? fallback ?? 'Unknown translation';
        },
        [translations],
    );

    const isTranslationExists = useCallback(
        (key: string) => {
            return translations[key] !== undefined;
        },
        [translations],
    );

    const getLanguages = useCallback(() => {
        return languages;
    }, [languages]);

    const contextValue = useMemo(
        () => ({ getLang, isTranslationExists, getLanguages }),
        [getLang, isTranslationExists, getLanguages],
    );

    return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
