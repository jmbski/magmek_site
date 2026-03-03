import { signal } from '@angular/core';
import { StrRecord } from '@app/typing';
import { label } from '@primeuix/themes/aura/metergroup';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { removeFromArray } from './utils';
import { LogLine } from '@app/models';

export const CoreMenuItems: MenuItem[] = [
    {
        label: 'Lore',
    },
    {
        label: 'Maps',
    },
    {
        label: 'HUD',
    },
    {
        label: 'Tools',
        items: [
            {
                label: 'RP Log Cleaner',
                routerLink: '/tools/log-cleaner',
            },
        ],
    },
];

export const CoreMenuItemsMega: MegaMenuItem[] = [
    {
        label: 'Lore',
    },
    {
        label: 'Maps',
    },
    {
        label: 'HUD',
    },
    {
        label: 'Tools',
        items: [
            [{label: 'RP Log Cleaner'}],
        ],
    },
];


export class AppDataModel {
    /* private static _ignoredChars: string[] = [];
    private static _charMapping: StrRecord = {};

    public static ignoredChars$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    public static charMapping$: BehaviorSubject<StrRecord> = new BehaviorSubject({});

    public static appendIgnored(names: string[]): void {

    } */

    private static _charMapping: StrRecord = {};
    private static _charSubs: Record<string, Subscription> = {};

    private static _ignored: string[] = [];
    private static _ignoredSubs: Record<string, Subscription> = {};

    public static charMapping$: BehaviorSubject<StrRecord> = new BehaviorSubject(this._charMapping);
    public static ignored$:  BehaviorSubject<string[]> = new BehaviorSubject(new Array<string>());

    public static latestInput: string = '';

    public static subscribeToMapping(name: string, callback?: (data: StrRecord) => void) {
        const existing = this._charSubs[name];
        if (existing) existing.unsubscribe();
        this._charSubs[name] = this.charMapping$.subscribe(callback);
    }

    public static nextMapping() {
        this.charMapping$.next(this._charMapping);
    }

    public static getCharMapping(): StrRecord {
        return this._charMapping;
    }

    public static addMappings(mappings: StrRecord) {
        Object.assign(this._charMapping, mappings);
        this.nextMapping();
    }

    public static delMappings(keys: string[]) {
        keys.forEach(key => delete this._charMapping[key]);
        this.nextMapping();
    }

    public static setCharMapping(mappings: StrRecord) {
        this._charMapping = mappings;
        this.nextMapping();
    }

    public static subscribeToIgnored(name: string, callback?: (keys: string[]) => void) {
        const existing = this._ignoredSubs[name];
        if (existing) existing.unsubscribe();
        this._ignoredSubs[name] = this.ignored$.subscribe(callback);
    }

    public static nextIgnored() {
        this.ignored$.next(this._ignored);
    }

    public static getIgnored(): string[] {
        return this._ignored;
    }

    public static delIgnored(keys: string[]) {
        removeFromArray(this._ignored, keys);
        this.nextIgnored();
    }

    public static addIgnored(keys: string[]) {
        this._ignored.push(...keys);
        this.nextIgnored();
    }

    public static setIgnored(keys: string[]) {
        this._ignored = keys;
        this.nextIgnored();
    }

    /* public static ignoredHandler: (names: string[]) => void = (names: string[]) => {
        console.log('ignoredHandler() not implemented');
    };
    public static charMapHandler: (charMap: StrRecord) => void = (charMap: StrRecord) => {
        console.log('chapMapHandler() not implemented');
    };

    public static addIgnored(names: string[]) {
        this.ignoredNames().push(...names);
        this.ignoredHandler(this.ignoredNames());
    }

    public static setIgnored(names: string[]) {
        this.ignoredNames.set(names);
        this.ignoredHandler(this.ignoredNames());
    }

    public static setCharMap(charMap: StrRecord, updateServer: boolean = false) {
        this.charMapping.set(charMap);
        if (updateServer) this.charMapHandler(charMap);
    }

    public static updateCharMapping(mapping: StrRecord) {
        Object.assign(this.charMapping(), mapping);
        this.charMapHandler(this.charMapping());
    }

    public static removeCharMapping(name: string) {
        delete this.charMapping()[name];
        this.charMapHandler(this.charMapping());
    }

    public static removeCharMappings(...names: string[]) {
        names.forEach(name =>  delete this.charMapping()[name]);
        this.charMapHandler(this.charMapping());
    } */


}
