import { PageLayout } from '@ag-app/layout';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MMContent } from '@shared/models/content';
import { ContentRenderer, SectionHeader, SplitHeader } from 'shared-utils';

@Component({
    selector: 'ag-dress-code',
    imports: [
        CommonModule,
        ContentRenderer,
        PageLayout,
        SectionHeader,
        SplitHeader,
    ],
    templateUrl: './dress-code.html',
    styleUrl: './dress-code.scss',
})
export class DressCode {

    public content: MMContent = {
        type: 'container',
        styleClass: 'w-full',
        items: [
            {
                type: 'split-header',
                header: 'Aetherglow RP Sim',
                items: [
                    {
                        type: 'subheader',
                        body: 'Dress Code & Avatar Policy',
                    },
                ],
            },
            {
                type: 'section',
                header: '1. Core Principle',
                items: [
                    {type: 'paragraph', body: 'All avatars and attire should align with the medieval fantasy tone of Aetherglow.'},
                    {type: 'paragraph', body: 'This is a high-magic, high-fantasy world, allowing for:'},
                    {type: 'break'},
                    {
                        type: 'bullet-list',
                        styleClass: 'ealist-disc mb-3 flex justify-center items-center flex-col',
                        items: [
                            {type: 'item', body: 'Magical constructs', styleClass: 'font-bold'},
                            {type: 'item', body: 'Exotic species', styleClass: 'font-bold'},
                            {type: 'item', body: 'Arcane or pseudo-scientific designs (especially elven-influenced)', styleClass: 'font-bold'},
                        ],
                    },
                    {type: 'break'},
                    {
                        type: 'paragraph',
                        body: 'All appearances must remain visually and thematically plausible within a fantasy setting.',
                        styleClass: 'text-xl font-bold text-center text-orange-200',
                    },
                ],
            },
            {type: 'break'},
            {
                type: 'section-header',
                header: '2. In-Character (IC) Appearance Guidelines',
            },
            {
                type: 'section',
                header: '2.1 Fantasy Theme Requirement',
                items: [
                    {type: 'paragraph', body: 'Avatars must visually fit within a medieval fantasy setting.'},
                    {type: 'paragraph', body: 'Allowed Examples:'},
                    {
                        type: 'bullet-list',
                        styleClass: 'list-disc mb-3 flex justify-center items-center flex-col',
                        items: [
                            {type: 'item', body: 'Knights, rogues, mages, nobles'},
                            {type: 'item', body: 'Fantasy races (elves, orcs, tieflings, etc.)'},
                            {type: 'item', body: 'Anthro or beastfolk (fantasy-styled)'},
                            {type: 'item', body: 'Golems, constructs, or arcane beings'},
                        ],
                    },
                    {type: 'paragraph', body: 'Not allowed:'},
                    {
                        type: 'bullet-list',
                        styleClass: 'list-disc mb-3 flex justify-center items-center flex-col',
                        items: [
                            {
                                type: 'item',
                                body: 'Sci-fi elements without fantasy reinterpretation',
                                items: [
                                    {type: 'item', body: '(e.g., space suits, futuristic armor, battle droids)'},
                                ],
                            },
                            {type: 'item', body: 'Clearly modern or real-world aesthetics that break immersion'},
                        ],
                    },
                ],
            },
            {
                type: 'section',
                header: '2.2 Modern Clothing (Limited Allowance)',
                items: [
                    {type: 'paragraph', body: 'Some “modern-looking” clothing is allowed only if it could reasonably be produced with pre-industrial methods.'},
                    {type: 'paragraph', body: 'Allowed examples:'},
                    {
                        type: 'bullet-list',
                        styleClass: 'list-disc mb-3 flex justify-center items-center flex-col',
                        items: [
                            {type: 'item', body: 'Simple shirts, blouses, tunic-like tops'},
                            {type: 'item', body: 'Basic pants, skirts, or dresses'},
                            {type: 'item', body: 'Leather or cloth footwear'},
                        ],
                    },
                    {type: 'paragraph', body: 'Not allowed:'},
                    {
                        type: 'bullet-list',
                        styleClass: 'list-disc mb-3 flex justify-center items-center flex-col',
                        items: [
                            {type: 'item', body: 'Sneakers, tennis shoes, or rubber/plastic-based footwear'},
                            {type: 'item', body: 'Zippers, synthetic materials, or modern fasteners'},
                            {type: 'item', body: 'Clothing dependent on modern manufacturing'},
                        ],
                    },
                ],
            },
        ],
    };
}
