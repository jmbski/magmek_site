import { RecordObject } from './general';

/**
 * Represents an element to render on a page
 */
export interface ElementBase {

    /**
     * The type of element to render
     */
    readonly elementType: string; // @todo: add type/enum later

    /**
     * The content to render in the element
     */
    content: unknown;

    /**
     * The style to apply to the element
     */
    style?: string;
    
    /**
     * The style class to apply to the element
     */
    styleClass?: string;

    /**
     * The options to apply to the element
     */
    options?: RecordObject;

    /**
     * The children of the element
     */
    children?: ElementBase[];

    [key: string]: unknown;
}

/**
 * Represents a block of text meant to be rendered as an illuminated text block.
 */
export interface TextBlock extends ElementBase {
    readonly elementType: 'text-block';
    content: string;
    illuminated?: boolean;
    illuminatedColor?: string;
    illuminatedBorder?: string;

    [key: string]: unknown;
}
