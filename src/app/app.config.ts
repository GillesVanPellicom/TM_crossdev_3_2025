import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// Configuration for the Angular application.
export const appConfig: ApplicationConfig = {
  providers: [
    // Sets up a global error handler for the application.
    provideBrowserGlobalErrorListeners(),
    // Provides the application's routing configuration.
    provideRouter(routes)
  ]
};
