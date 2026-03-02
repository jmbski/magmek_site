import { Component, computed, inject, Input, signal, ViewChild } from '@angular/core';
import { AppDataModel } from '@app/core';
import { InputBase } from '@app/models';
import { InputService, InputControlService } from '@app/services';
import { isWeakObj, KeyValueType, StrRecord, WeakObj } from '@app/typing';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicForm } from '../dynamic-form/dynamic-form';
import { MenuItem, MenuItemCommandEvent, SharedModule } from 'primeng/api';
import { isArray } from 'lodash';
import { Menubar } from 'primeng/menubar';

@Component({
    selector: 'app-form-dialog',
    imports: [DynamicForm, SharedModule, Menubar],
    templateUrl: './form-dialog.html',
    styleUrl: './form-dialog.scss',
})
export class FormDialog {
    private readonly inputSvc = inject(InputService);
    private readonly ctlSvc = inject(InputControlService);

    public inputs = signal<InputBase<unknown>[]>(new Array<InputBase<unknown>>());

    public showButtons = computed(() => {
        return this.dialogService.getInstance(this.ref)?.data?.showButtons;
    });

    public showAddButton = computed<boolean>(() => {
        const {showAddButton} = this.dialogData;
        return showAddButton === true;
    });

    public menuModel: MenuItem[] = [];

    public dialogData: WeakObj = {};

    public canLoad = signal(false);

    @ViewChild(DynamicForm) dynamicForm!: DynamicForm;

    constructor(
        public dialogService: DialogService,
        public ref: DynamicDialogRef,

    ) {
        const data = this.dialogService.getInstance(this.ref)?.data;
        if (isWeakObj(data)) this.dialogData = data;

        const {menuModel, inputs} = this.dialogData;
        if (isArray(menuModel)) {
            this.menuModel = menuModel;
        }

        if (isArray(inputs)) {
            this.inputs.set(inputs);
        }
    }

    ngAfterViewInit() {
        this.canLoad.set(true);

        const menuModel: MenuItem[] = [
            {
                label: 'Cancel',
                icon: 'pi pi-times',
                iconClass: 'text-red-500!',
                command: (event: MenuItemCommandEvent) => {
                    event.originalEvent?.stopImmediatePropagation();
                    this.cancel();
                },
            },
            {
                label: 'Submit',
                icon: 'pi pi-check',
                iconClass: 'text-green-400!',
                command: (event: MenuItemCommandEvent) => {
                    event.originalEvent?.stopImmediatePropagation();
                    this.submit();
                },
            },
        ];
        if (this.showAddButton()) {
            menuModel.splice(1,0,
                {
                    label: 'Add Entry',
                    icon: 'pi pi-plus',
                    command: (event: MenuItemCommandEvent) => {
                        event.originalEvent?.stopImmediatePropagation();
                        this.addEntry();
                    },
                });
        }
        this.menuModel = menuModel;
    }

    public addEntry() {
        const len = this.inputs().length;
        const input = this.inputSvc.newTextboxQuestion(`char-${len}`, '', len, {
            colSpans: 2,
            removable: true,
        });

        this.ctlSvc.addControl(this.dynamicForm.form(), input);
        this.inputs().push(input);
    }

    public cancel() {
        this.ref.close();
    }

    public submit() {
        const formValues = this.inputSvc.parseFormResult(this.dynamicForm.form(), this.inputs());
        this.ref.close(formValues);
    }

}
