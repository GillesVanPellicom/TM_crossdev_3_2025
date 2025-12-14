import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Bootstrap the Angular application.
// This initializes the Angular framework and renders the root component (App).
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
