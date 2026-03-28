import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@ag-env';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
    providers: [
        provideEchartsCore({echarts: () => import('echarts')}),
        provideHttpClient(),
        provideBrowserGlobalErrorListeners(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.tt-dark',
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
