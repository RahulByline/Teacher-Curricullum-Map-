import { useState } from 'react';

interface Settings {
  portalLogo: string;
  portalName: string;
  theme: 'light' | 'dark';
}

const defaultSettings: Settings = {
  portalLogo: '',
  portalName: 'Curriculum Manager',
  theme: 'light'
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('curriculum-portal-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('curriculum-portal-settings', JSON.stringify(newSettings));
  };

  return {
    settings,
    updateSettings
  };
}