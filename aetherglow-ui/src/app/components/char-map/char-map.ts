import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { AppDataModel } from '@app/core';
import { InputBase } from '@app/models';
import { InputControlService, InputService } from '@app/services';
import { KeyValueType, StrRecord } from '@app/typing';
import { DynamicForm } from '../dynamic-form/dynamic-form';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-char-map',
    imports: [
        AsyncPipe,
        DynamicForm,
        ButtonModule
    ],
    templateUrl: './char-map.html',
    styleUrl: './char-map.scss',
})
export class CharMap {
    //public inputs$: Observable<InputBase<KeyValueType>[]> = inject(InputService).fromStrRecord(AppDataModel.charMapping());
    private readonly inputSvc = inject(InputService);
    private readonly ctlSvc = inject(InputControlService);

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
        AppDataModel.charMapping$.subscribe(next => {
            this.inputs.set(this.inputSvc.fromStrRecord(next));
        });
    }

    ngOnInit() {



        /* const charMap = AppDataModel.charMapping;

        Object.assign(this.originalData, charMap); */

        /* const inputs = this.inputSvc.fromStrRecord(charMap);
        this.inputs.set(inputs); */
    }

    public cancel() {
        this.ref.close();
    }

    public submit() {
        const formValues = this.inputSvc.toStrRecord(this.charMapForm.form().getRawValue());
        this.ref.close(formValues);
    }

    public addEntry() {
        const form = this.charMapForm.form();

        this.ctlSvc.addControl(form,
            this.inputSvc.newKVInput(Object.keys(AppDataModel.getCharMapping()).length)
        );

        AppDataModel.setCharMapping(this.inputSvc.toStrRecord(form.getRawValue()));
    }
}
