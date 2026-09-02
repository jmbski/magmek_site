import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Overlay } from 'primeng/overlay';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { Drawer } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';

export * from './constants';
export * from './directives/_index';
export * from './pipes/_index';
export * from './general-type-guards';
export * from './page-type-guards';

export const ANGULAR_COMMON = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
];

export const PRIME_COMMON = [
    AutoCompleteModule,
    BlockUIModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    Select,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    Overlay,
    PanelModule,
    RippleModule,
    Drawer,
    ToastModule
];
