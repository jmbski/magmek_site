import { stringLiterals, UnionTypeOf } from '@shared/typing';

export const MMContentTypes = stringLiterals(
    'accordion',
    'accordion-item',
    'break',
    'bullet-list',
    'container',
    'divider',
    'field-set',
    'item',
    'panel',
    'paragraph',
    'section',
    'section-header',
    'span',
    'split-header',
    'subheader',
);
export type MMContentType = UnionTypeOf<typeof MMContentTypes>;


export interface MMContent {
    body?: string;
    header?: string;
    type: MMContentType;
    styleClass?: string;
    items?: MMContent[];

}
