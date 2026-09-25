import * as en from './languages/en.json';
import * as fr from './languages/fr.json';
import * as nb from './languages/nb.json';
import * as zh from './languages/zh.json';

const languages: Record<string, any> = {
  en: en,
  fr: fr,
  nb: nb,
  zh: zh,
  zh_Hans: zh,
  zh_Hant: zh,
};

const fallbackLanguage = 'en';

/** 模块级 hass 缓存 — 通过 setHass() 注入 */
let _cachedHass: any = null;

/**
 * 卡片/编辑器在 hass setter 中调用此方法，让 localize 能读取到 HA 的语言设置
 */
export function setHass(hass: any): void {
  if (hass) {
    _cachedHass = hass;
  }
}

const normalizeLanguage = (language: string): string => {
  return language.replace(/['"]+/g, '').replace(/[-:]/g, '_').toLowerCase();
};

const isLanguageSupported = (language: string): boolean => {
  return Object.keys(languages).includes(language);
};

/**
 * 智能匹配语言：先精确匹配，再尝试去掉地区码逐步匹配
 */
const resolveLanguage = (rawLanguage: string): string => {
  const normalized = normalizeLanguage(rawLanguage);

  if (isLanguageSupported(normalized)) {
    return normalized;
  }

  const parts = normalized.split('_');
  for (let i = parts.length; i >= 1; i--) {
    const candidate = parts.slice(0, i).join('_');
    if (isLanguageSupported(candidate)) {
      return candidate;
    }
  }

  return fallbackLanguage;
};

/**
 * 从 HA hass 对象获取当前语言（按优先级）
 * 新版 HA: hass.locale.language → hass.language（deprecated）→ hass.selectedLanguage
 */
const getLanguageFromHass = (): string | null => {
  if (!_cachedHass) return null;

  try {
    if (_cachedHass.locale && _cachedHass.locale.language) {
      return _cachedHass.locale.language;
    }
    if (_cachedHass.language) {
      return _cachedHass.language;
    }
    if (_cachedHass.selectedLanguage) {
      return _cachedHass.selectedLanguage;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

const getCurrentLanguage = (): string => {
  // 1. 优先从 hass 对象读取（最权威）
  const hassLang = getLanguageFromHass();
  if (hassLang) return hassLang;

  // 2. localStorage（旧版 HA 兼容）
  try {
    const lsLang = localStorage.getItem('selectedLanguage');
    if (lsLang) return lsLang;
  } catch (e) {
    // ignore
  }

  // 3. 浏览器语言
  try {
    if (navigator.language) return navigator.language;
  } catch (e) {
    // ignore
  }

  return 'en';
};

export function localize(string: string, search = '', replace = ''): string {
  const section = string.split('.')[0];
  const key = string.split('.')[1];

  const rawLanguage = getCurrentLanguage();
  let language = resolveLanguage(rawLanguage);

  let translated: string | undefined = languages[language]?.[section]?.[key];

  // 当前语言缺少翻译时回退到英语（fr/nb 等部分翻译语言避免显示原始 key）
  if (translated === undefined && language !== fallbackLanguage) {
    translated = languages[fallbackLanguage]?.[section]?.[key];
  }

  if (translated === undefined) {
    return string;
  }

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
