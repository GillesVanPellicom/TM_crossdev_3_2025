import { Component } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-settings',
  template: `
    <h2>Settings</h2>
    <div class="setting-item">
      <label for="accent-color">Accent Color:</label>
      <input
        id="accent-color"
        type="color"
        [value]="themeService.getAccentColor()"
        (input)="onColorChange($event)"
      />
    </div>
  `,
  styles: [
    `
      h2 {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
      .setting-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      label {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 16px;
        margin-right: 10px;
      }
    `,
  ],
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
