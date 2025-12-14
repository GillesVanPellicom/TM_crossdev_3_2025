import { Component } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-settings',
  template: `
    <h2>Settings</h2>
    <div>
      <label for="accent-color">Accent Color:</label>
      <input
        id="accent-color"
        type="color"
        [value]="themeService.getAccentColor()"
        (input)="onColorChange($event)"
      />
    </div>
  `,
  styles: [],
})
export class SettingsComponent {
  constructor(public themeService: ThemeService) {}

  // Handles the color input change event.
  // Updates the accent color in the theme service.
  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.themeService.setAccentColor(color);
  }
}
