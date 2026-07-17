import { Language } from './translations';

type TabId = 'mission_control' | 'off_ramp';

export function getSavedLanguage(): Language {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('fifa_lang') as Language) || 'en';
  }
  return 'en';
}

export function saveLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fifa_lang', lang);
  }
}

export function getSavedTab(): TabId {
  if (typeof window !== 'undefined') {
    return (sessionStorage.getItem('fifa_active_tab') as TabId) || 'mission_control';
  }
  return 'mission_control';
}

export function saveTab(tab: TabId): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('fifa_active_tab', tab);
  }
}

export function getSavedLayout(): 'grid' | 'list' {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('fifa_layout') as 'grid' | 'list') || 'grid';
  }
  return 'grid';
}

export function saveLayout(layout: 'grid' | 'list'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fifa_layout', layout);
  }
}

export function getSavedShiftActive(): boolean {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('fifa_shift_active') === 'true';
  }
  return false;
}

export function saveShiftActive(active: boolean): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('fifa_shift_active', active ? 'true' : 'false');
  }
}
