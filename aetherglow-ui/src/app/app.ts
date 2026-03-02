import { Component, inject, Inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@app/environment';
import { ButtonModule } from 'primeng/button';
import { AppDataModel } from './core';
import { TxService } from './services';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('Aetherglow');
    private readonly txSvc = inject(TxService);

    public env = environment;

    ngOnInit() {
        this.txSvc.getCharMapping().then(charMap => {

            AppDataModel.setCharMapping(charMap);
        });
    }
}
