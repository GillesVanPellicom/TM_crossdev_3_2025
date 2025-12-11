import { Routes } from '@angular/router';
import { NormalCalculatorComponent } from './normal-calculator.component';
import { ScientificCalculatorComponent } from './scientific-calculator.component';
import { SettingsComponent } from './settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/normal', pathMatch: 'full' },
  { path: 'normal', component: NormalCalculatorComponent },
  { path: 'scientific', component: ScientificCalculatorComponent },
  { path: 'settings', component: SettingsComponent },
];
