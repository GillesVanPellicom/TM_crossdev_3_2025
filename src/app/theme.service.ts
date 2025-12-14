import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electronAPI: {
      getSettings: () => Promise<any>;
      setSettings: (settings: any) => void;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private accentColor = '';

  constructor() {
    this.loadTheme();
  }

  async loadTheme() {
    const settings = await window.electronAPI.getSettings();
    if (settings && settings.accentColor) {
      this.accentColor = settings.accentColor;
    } else {
      this.accentColor = '#3366FF'; // Default color
      window.electronAPI.setSettings({ accentColor: this.accentColor });
    }
    this.applyAccentColor();
  }

  setAccentColor(color: string) {
    this.accentColor = color;
    this.applyAccentColor();
    window.electronAPI.setSettings({ accentColor: color });
  }

  getAccentColor() {
    return this.accentColor;
  }

  private applyAccentColor() {
    document.documentElement.style.setProperty('--accent-color', this.accentColor);
  }
}
