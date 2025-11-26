import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AuthInterceptorProvider } from './app/auth/interceptors/auth.interceptor';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';

import { provideServiceWorker, ServiceWorkerModule } from '@angular/service-worker';
import { isDevMode, importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent , {
    providers: [
        
        // HTTP Client with functional interceptor
        provideHttpClient(withInterceptorsFromDi()),
        // Animations
        provideAnimations(),
        // Router
        provideRouter(routes),
        // Toastr
        provideToastr({}),
        // Service Worker
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        //zoneless experimental 
        //provideExperimentalZonelessChangeDetection(),
    ]
})
  .catch(err => console.error(err));

/*
    **this removed because of standalone components approach**

  importProvidersFrom(BrowserModule, FormsModule, // required animations module
        ToastrModule.forRoot(), // ToastrModule added
        AppRoutingModule, ReactiveFormsModule, ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: "registerWhenStable:30000",
        })),
        AuthInterceptorProvider,
*/