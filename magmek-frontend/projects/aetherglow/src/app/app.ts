import { Component, inject, Inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@ag-env';
import { ButtonModule } from 'primeng/button';
import { TxService } from './services';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'ag-root',
    imports: [
        RouterOutlet,
        ButtonModule,
        Toast,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    providers: [MessageService],
})
export class App {
    protected readonly title = signal('Aetherglow');
    private readonly txSvc = inject(TxService);
    private readonly msgSvc = inject(MessageService);

    public env = environment;

    ngOnInit() {
    }
}
