import { Routes } from '@angular/router';
import { NormalCalculatorComponent } from './normal-calculator.component';
import { ScientificCalculatorComponent } from './scientific-calculator.component';
import { SettingsComponent } from './settings.component';

// Defines the application's routes.
export const routes: Routes = [
  // Redirect the root path to the normal calculator by default.
  { path: '', redirectTo: '/normal', pathMatch: 'full' },
  // Route for the normal calculator component.
  { path: 'normal', component: NormalCalculatorComponent },
  // Route for the scientific calculator component.
  { path: 'scientific', component: ScientificCalculatorComponent },
  // Route for the settings component.
  { path: 'settings', component: SettingsComponent },
];
