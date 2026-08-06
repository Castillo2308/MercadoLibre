'use client';

/**
 * LanguageContext.tsx
 *
 * Maneja el idioma activo de la interfaz (es/en), persistido en
 * localStorage. Expone `t(key)` para traducir textos registrados en
 * lib/i18n.ts. Sigue el mismo patron que ThemeContext para mantener
 * consistencia y evitar parpadeos al cargar.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKey } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LOCALE_STORAGE_KEY = 'kivra-locale';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'es' || saved === 'en') {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(() => setLocaleState((current) => (current === 'es' ? 'en' : 'es')), []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const template: string = translations[locale][key] ?? translations.es[key] ?? key;
      if (!params) return template;
      return Object.entries(params).reduce<string>(
        (text, [paramKey, paramValue]) => text.split(`{{${paramKey}}}`).join(String(paramValue)),
        template
      );
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, toggleLocale, t }), [locale, setLocale, toggleLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  }
  return context;
}
