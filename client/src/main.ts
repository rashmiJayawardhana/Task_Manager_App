import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module'; // Adjust path
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoAngularMaterailModule } from './app/DemoAngularMaterialModule'; // Adjust path

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule),         // Add routing
    importProvidersFrom(BrowserAnimationsModule),  // Add animations
    importProvidersFrom(DemoAngularMaterailModule) // Add your material module
  ]
}).catch(err => console.error(err));
