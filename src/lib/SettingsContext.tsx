'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PLACEHOLDER } from '@/lib/constants';

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  instagram: string;
  facebook: string;
  telegram: string;
  viber: string;
  whatsapp: string;
  site_title: string;
  site_description: string;
}

const defaultSettings: SiteSettings = {
  phone: PLACEHOLDER.phone,
  email: PLACEHOLDER.email,
  address: PLACEHOLDER.address,
  working_hours: PLACEHOLDER.workingHours,
  instagram: PLACEHOLDER.instagram,
  facebook: PLACEHOLDER.facebook,
  telegram: PLACEHOLDER.telegram,
  viber: PLACEHOLDER.viber,
  whatsapp: PLACEHOLDER.whatsapp,
  site_title: PLACEHOLDER.companyName,
  site_description: PLACEHOLDER.siteDescription,
};

interface SettingsContextValue {
  settings: SiteSettings;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  isLoading: true,
});

export function useSettings() {
  return useContext(SettingsContext);
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({
            ...prev,
            ...data,
            // Also set whatsapp from viber if not set separately
            whatsapp: data.whatsapp || data.viber || prev.whatsapp,
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}
