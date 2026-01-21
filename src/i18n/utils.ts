import { ui, defaultLang, type UIKeys } from './ui';

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKeys): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  return `/${lang}${path === '/' ? '' : path}`;
}

export function switchLang(currentUrl: URL, newLang: Lang): string {
  const pathname = currentUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);

  // Replace the first segment (language) or add it
  if (segments[0] in ui) {
    segments[0] = newLang;
  } else {
    segments.unshift(newLang);
  }

  return '/' + segments.join('/');
}
