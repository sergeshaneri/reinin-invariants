export const SUPPORTED_LOCALES = Object.freeze(['ru', 'en'] as const);

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

export type LocalizedRecord<T = string> = Readonly<{
  ru: T;
  en?: T;
}>;

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== 'string') return DEFAULT_LOCALE;

  const locale = value.trim().toLowerCase();
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getLocalizedValue<T>(
  record: LocalizedRecord<T>,
  locale: unknown,
): T {
  const normalizedLocale = normalizeLocale(locale);
  return record[normalizedLocale] ?? record.ru;
}
