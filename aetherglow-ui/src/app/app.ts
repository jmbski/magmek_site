import { Component, inject, Inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@app/environment';
import { ButtonModule } from 'primeng/button';
import { AppDataModel } from './core';
import { TxService } from './services';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
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
