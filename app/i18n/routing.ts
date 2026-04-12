import { defineRouting } from 'next-intl/routing';
import { LANGUAGES } from '@/i18n/config';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: Object.values(LANGUAGES),

  // Used when no locale matches
  defaultLocale: LANGUAGES.EN,
  localeCookie: true,
});
