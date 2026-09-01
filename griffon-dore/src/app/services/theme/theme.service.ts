import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ElementType, stringLiterals } from '@app/models';
import { BehaviorSubject } from 'rxjs';

export const ThemeNames = stringLiterals('viva-dark', 'viva-light', 'medieval-wood', 'blank', 'layout');
export type ThemeName = ElementType<typeof ThemeNames>;

export const PrimaryTheme: BehaviorSubject<ThemeName> = new BehaviorSubject<ThemeName>('layout');
export const SecondaryTheme: BehaviorSubject<ThemeName> = new BehaviorSubject<ThemeName>('medieval-wood');

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    public linkElementMap: {[key: string]: HTMLLinkElement} = {};

    constructor(@Inject(DOCUMENT) private document: Document) {
        const linkElements: HTMLLinkElement[] = Array.from(document.getElementsByTagName('link'));
        const themeELements: HTMLLinkElement[] = linkElements.filter(element => element.rel === 'stylesheet' && element.id !== '');
        themeELements.forEach(element => {
            this.linkElementMap[element.id] = element;
        });
    }


    switchTheme(theme: ThemeName, linkId: string = 'base-theme') {
        let themeLink: HTMLLinkElement | undefined = this.linkElementMap[linkId];
        /* <link id="secondary-theme" rel="stylesheet" type="text/css" href="/blank.css" /> */
        if(themeLink == undefined) {
            themeLink = document.createElement('link');
            const linkProperties: Partial<HTMLLinkElement> = {
                id: linkId,
                rel: 'stylesheet',
                type: 'text/css',
                href: `/${theme}.css`
            };
            Object.assign(themeLink, linkProperties);
            this.document.head.appendChild(themeLink);
            this.linkElementMap[linkId] = themeLink;
        }

        const themeCSS = theme + '.css';

        if (!themeLink?.href.endsWith(themeCSS)) {
            themeLink.href = themeCSS;
        }
    }
}
