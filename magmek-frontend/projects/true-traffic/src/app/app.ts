import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Environment } from '@tt-env';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
    selector: 'tt-root',
    imports: [
        RouterOutlet,

    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('true-traffic');

    protected readonly env = Environment;
}
