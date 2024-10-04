import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ErrorResponseInterceptor } from './interceptor/error-response.interceptor';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlEsp } from './utils/mat-paginator-intl-esp';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([ErrorResponseInterceptor, AuthInterceptor ]),
      
      ),

    provideAnimations(), // required animations providers
    provideToastr(), provideAnimationsAsync(), 
    MatTableModule,
    MatPaginatorModule,
    MatInputModule, // Añadir aquí los módulos de Angular Material
    MatTableDataSource,
    ReactiveFormsModule,
    PdfViewerModule,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEsp }
  ]
};
