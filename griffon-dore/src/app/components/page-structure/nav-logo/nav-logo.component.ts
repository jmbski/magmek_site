import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PrimaryTheme, SecondaryTheme, ThemeName } from '@app/services';

@Component({
    selector: 'gdo-nav-logo',
    standalone: true,
    imports: [],
    templateUrl: './nav-logo.component.html',
    styleUrl: './nav-logo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavLogoComponent {
    public primaryTheme: ThemeName = 'viva-dark';
    public secondaryTheme: ThemeName = 'blank';

    public logoImage: string = 'assets/images/wulfgard-ermine-alpha.png';

    constructor(private cd: ChangeDetectorRef) {
        PrimaryTheme.subscribe((theme: ThemeName) => {
            this.primaryTheme = theme;
            this.cd.markForCheck();
        });

        SecondaryTheme.subscribe((theme: ThemeName) => {
            this.secondaryTheme = theme;
            this.cd.markForCheck();
        });
    }
}
