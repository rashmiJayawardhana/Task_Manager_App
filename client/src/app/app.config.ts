import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // For BrowserAnimationsModule
import { provideClientHydration } from '@angular/platform-browser'; // For BrowserModule
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(), // Replaces BrowserModule
    provideAnimations(),      // Replaces BrowserAnimationsModule
    provideHttpClient(),
  ],
};