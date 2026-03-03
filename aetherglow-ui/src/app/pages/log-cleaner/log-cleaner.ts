import { ChangeDetectorRef, Component, inject, signal, ViewChildren } from '@angular/core';
import { PageLayout } from '@app/layout';
import { CardModule } from 'primeng/card';
import { Textarea, TextareaModule } from 'primeng/textarea';
import { Panel } from 'primeng/panel';

import { AGDialogSvc, InputControlService, InputService, TxService } from '@app/services';
import { CharMap } from '@app/components';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isStrArray, isStrRecord, isWeakObj } from '@app/typing';
import { AppDataModel, downloadTextAsFile } from '@app/core';
import { FormsModule } from '@angular/forms';
import { min } from 'lodash';
import { InputBase, LogCleanInputSettings } from '@app/models';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { FormDialog } from '../../components/form-dialog/form-dialog';
import { MessagingSvc } from '../../services/messaging.service';



@Component({
    selector: 'app-log-cleaner',
    imports: [
        PageLayout,
        TextareaModule,
        CardModule,
        Panel,
        DialogModule,
        FormsModule,
        Menubar,
    ],
    templateUrl: './log-cleaner.html',
    providers: [InputService],
    styleUrl: './log-cleaner.scss',

})
export class LogCleaner {

    private readonly dialogSvc = inject(AGDialogSvc);
    private readonly inputSvc = inject(InputService);
    private readonly ctlSvc = inject(InputControlService);
    private readonly txSvc = inject(TxService);
    private readonly msgSvc = inject(MessagingSvc);

    public inputMenuModel: MenuItem[] = [
        {
            label: 'Character Names',
            command: (event: MenuItemCommandEvent) => {
                event.originalEvent?.stopImmediatePropagation();
                this.openCharMapEditor();
            },
        },
        {
            label: 'Ignored Names',
            command: (event: MenuItemCommandEvent) => {
                event.originalEvent?.stopImmediatePropagation();
                console.log('opening ignored');
                this.openIgnoredCharEditor();
            },
        },
        {
            label: 'Unmapped Names',
            command: (event: MenuItemCommandEvent) => {
                event.originalEvent?.stopImmediatePropagation();
                this.openNewNamesDialog();
            },
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: (event: MenuItemCommandEvent) => {
                event.originalEvent?.stopImmediatePropagation();
                this.openSettingsDialog();
            },
        },
        {
            label: 'Submit',
            icon: 'pi pi-upload',
            command: (event: MenuItemCommandEvent) => {
                event.originalEvent?.stopImmediatePropagation();
                this.submitText();
            },
        },
    ];

    public outputMenuModel: MenuItem[] = [
        {
            label: 'Download',
            icon: 'pi pi-download',
            command: (event: MenuItemCommandEvent) => {
                event.originalEvent?.stopImmediatePropagation();
                const filename = `${this.settings.eventCategory}-${this.settings.title}_${new Date(Date.now()).toISOString()}.txt`;
                downloadTextAsFile(this.outputText(), filename);
            },
        },
        {
            label: 'Copy',
            icon: 'pi pi-clipboard',
            command: (event) => {
                event.originalEvent?.stopImmediatePropagation();
                navigator.clipboard.writeText(this.outputText());
            },
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
        },
    ];

    public settings: LogCleanInputSettings = {
        eventCategory: 'SL RP Chat Log',
        title: 'RP Chat Event',
    };

    public unmappedNames: string[] = [];

    public dividerClassFull: string = 'w-full m-4! bg-white h-[1px] shadow-[0px_0px_12px_1px_#ABF]';
    public visible = signal(false);

    public inputText = signal<string>('');
    public outputText = signal<string>('');

    public ref: DynamicDialogRef | null = null;

    @ViewChildren(Textarea) textAreas!: Textarea[];

    get inputRows() {
        return min([this.inputText().split('\n').length, 15]);
    }

    get outputRows() {
        return min([this.outputText().split('\n').length, 10]);
    }

    constructor(
        public cd: ChangeDetectorRef,
    ) {}

    ngAfterViewInit() {
        const cookieText = localStorage.getItem('input-text');
        if (cookieText) this.inputText.set(cookieText);

        this.textAreas.forEach(area => {
            if (area.el.nativeElement.id === 'inputTextArea') {
                area.ngControl?.valueChanges?.subscribe(val => {
                    localStorage.setItem('input-text', val);
                });
            }
        });

        if(this.inputText()) {
            this.submitText();
        }
    }

    public openCharMapEditor() {
        this.ref = this.dialogSvc.openDialog({type: CharMap, config: {
            header: 'Edit Character Name Mappings',

            data: {
                showButtons: false,
            },
        }});

        this.ref?.onClose.subscribe(formValues => {
            if (isStrRecord(formValues)) {
                this.txSvc.setCharMapping(formValues).then(resp => {
                    AppDataModel.charMapping$.next(resp);
                });
            }
        });
    }

    public async openIgnoredCharEditor() {
        const opts = <InputBase<unknown>>{
            colSpans: 2,
            removable: true,
            copyable: true,
        };

        const ignored = await this.txSvc.getIgnored();
        const inputs = this.inputSvc.fromArray(ignored, opts);

        const ref = this.dialogSvc.openDialog({type: FormDialog, config: {
            header: 'Edit Ignored Names',
            data: {
                showButtons: false,
                showAddButton: true,
                inputs,
            },
        }});

        ref?.onClose.subscribe(data => {
            if (!isWeakObj(data)) return;

            const values = Object.values(data);
            if(isStrArray(values)) {
                this.txSvc.setIgnored(values);
            }
        });
    }

    public openSettingsDialog() {
        const settings: Partial<LogCleanInputSettings> = Object.assign({}, this.settings);
        const inputs = this.inputSvc.fromStrRecord(settings);

        const ref = this.dialogSvc.openDialog({type: FormDialog, config: {
            data: {
                inputs,
            },
        }});

        ref?.onClose.subscribe(formValues => {
            if(isWeakObj(formValues)) {
                Object.assign(this.settings, formValues);
                this.msgSvc.successToast('Input settings updated');
            }
        });
    }

    public openNewNamesDialog() {
        this.txSvc.getUnmappedNames(this.inputText()).then(resp => {

            const inputs = this.inputSvc.fromArray(resp, {
                colSpans: 2,
                ignorable: true,
                mappable: true,
                disabled: true,
                required: false,
                showLabel: false,
                hasExamples: true,
            });

            const ref = this.dialogSvc.openDialog({type: FormDialog, config: {
                header: 'Unmapped Names',
                data: {
                    inputs,
                    hideMenu: true,
                },
            }});

            ref?.onClose.subscribe(data => {
                if (isWeakObj(data)) {
                    const {action} = data;
                    if (action === 'reload') {
                        this.openNewNamesDialog();
                    }
                }
            });
        });
    }

    public submitText() {
        this.msgSvc.infoToast('Sending data to server');
        this.txSvc.cleanLog(this.inputText()).then(resp => {
            this.unmappedNames = resp.newNames;
            this.outputText.set(resp.output);
            if(resp.newNames && resp.newNames.length > 0) {
                this.openNewNamesDialog();
            }
        })
            .catch(err => {
                console.log('Error content:',err);
            })
            .finally(() => {
                console.log('clean end');
            });
    }
}
