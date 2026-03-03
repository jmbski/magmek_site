import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '@app/environment';
import { provideHttpClient } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [

        provideHttpClient(),
        provideBrowserGlobalErrorListeners(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.ag-dark',
                },
            },
            ripple: true,
        }),
        {provide: DialogService},
        {provide: DynamicDialogRef},
        {provide: MessageService},
        provideRouter(routes),
        { provide: APP_BASE_HREF, useValue: environment.baseHref },

    ],
};
