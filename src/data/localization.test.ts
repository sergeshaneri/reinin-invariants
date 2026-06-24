import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getLocalizedValue,
  isLocale,
  normalizeLocale,
  type LocalizedRecord,
  type Locale,
} from './localization';

describe('localization helpers', () => {
  it('defines supported locales and the default locale', () => {
    expect(DEFAULT_LOCALE).toBe('ru');
    expect(SUPPORTED_LOCALES).toEqual(['ru', 'en']);
  });

  it('guards locale strings', () => {
    expect(isLocale('ru')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
  });

  it('normalizes locale strings to supported locale values', () => {
    expect(normalizeLocale('ru')).toBe('ru');
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale(' EN ')).toBe('en');
    expect(normalizeLocale('fr')).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it('returns the requested localized value when it exists', () => {
    const label = { ru: 'РУ', en: 'EN' } satisfies LocalizedRecord;

    expect(getLocalizedValue(label, 'ru')).toBe('РУ');
    expect(getLocalizedValue(label, 'en')).toBe('EN');
  });

  it('falls back to Russian for missing English and invalid locales', () => {
    const label = { ru: 'РУ' } satisfies LocalizedRecord;

    expect(getLocalizedValue(label, 'en')).toBe('РУ');
    expect(getLocalizedValue(label, 'fr')).toBe('РУ');
  });

  it('does not mutate localized records or supported locales', () => {
    const label = { ru: 'РУ', en: 'EN' } satisfies LocalizedRecord;
    const before = { ...label };

    getLocalizedValue(label, 'en');
    getLocalizedValue(label, 'fr');

    expect(label).toEqual(before);
    expect(Object.isFrozen(SUPPORTED_LOCALES)).toBe(true);
  });

  it('exposes the Locale type as the supported locale union', () => {
    const locale: Locale = 'ru';

    expect(locale).toBe('ru');
  });
});
