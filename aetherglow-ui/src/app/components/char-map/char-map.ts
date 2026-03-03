import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { AppDataModel } from '@app/core';
import { InputBase } from '@app/models';
import { InputControlService, InputService, TxService } from '@app/services';
import { KeyValueType, StrRecord } from '@app/typing';
import { DynamicForm } from '../dynamic-form/dynamic-form';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
    selector: 'app-char-map',
    imports: [
        DynamicForm,
        ButtonModule,
        Menubar,
    ],
    templateUrl: './char-map.html',
    styleUrl: './char-map.scss',
})
export class CharMap {
    //public inputs$: Observable<InputBase<KeyValueType>[]> = inject(InputService).fromStrRecord(AppDataModel.charMapping());
    private readonly inputSvc = inject(InputService);
    private readonly ctlSvc = inject(InputControlService);
    private readonly txSvc = inject(TxService);

    public menuModel: MenuItem[] = [
        {
            label: 'Cancel',
            icon: 'pi pi-times',
            labelClass: 'text-red-500',
            iconClass: 'text-red-500!',
            command: () => {this.cancel();},
        },
        {
            label: 'Add',
            icon: 'pi pi-plus',
            command: () => {this.addEntry();},
        },
        {
            label: 'Reset',
            icon: 'pi pi-refresh',
            command: () => {this.resetData();},

        },
        {
            label: 'Save',
            icon: 'pi pi-save',
            command: () => {this.submit();},
        },
    ];

    public modelData = signal<StrRecord>({});


    public inputs = signal<InputBase<KeyValueType>[]>(new Array<InputBase<KeyValueType>>());

    public showButtons = computed(() => {
        return this.dialogService.getInstance(this.ref)?.data?.showButtons;
    });


    public originalData: StrRecord = {};

    @ViewChild(DynamicForm) charMapForm!: DynamicForm;

    constructor(
        public dialogService: DialogService,
        public ref: DynamicDialogRef,

    ) {
        this.originalData = AppDataModel.getCharMapping();
        /* AppDataModel.charMapping$.subscribe(next => {
            this.inputs.set(this.inputSvc.kvFromStrRecord(next));
        }); */
        this.txSvc.getCharMapping().then(resp => {
            const inputs = this.inputSvc.kvFromStrRecord(resp);
            this.inputs.set(inputs);
        });
    }

    ngOnInit() {



        /* const charMap = AppDataModel.charMapping;

        Object.assign(this.originalData, charMap); */

        /* const inputs = this.inputSvc.fromStrRecord(charMap);
        this.inputs.set(inputs); */
    }

    public cancel() {
        this.resetData();
        this.ref.close();
    }

    public submit() {
        const formValues = this.inputSvc.toStrRecord(this.charMapForm.form().getRawValue());
        this.ref.close(formValues);
    }

    public addEntry() {
        const form = this.charMapForm.form();
        const input =     this.inputSvc.newKVInput(this.inputs().length);
        console.log('input', input);
        this.ctlSvc.addControl(form, input);
        this.inputs().push(input);

    }

    public resetData() {
        AppDataModel.setCharMapping(this.originalData);
    }
}
