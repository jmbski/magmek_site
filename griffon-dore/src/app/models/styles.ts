import { ModdableType, TypedContainer, GeneralFunction, WSParams } from '@app/models';

/**
 * Matches the type for the Angular NgClass properties
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StyleClass = string | string[] | Set<string> | { [klass: string]: any; };

export type AsKeyString<T> = {
    -readonly [K in keyof T]?: string | undefined;
};

/**
 * A version of the {@link CSSStyleDeclaration} interface that allows for optional values.
 */
export type BaseStyleValues = AsKeyString<CSSStyleDeclaration>;
export type StyleKey = keyof BaseStyleValues;

/**
 * A version of the {@link CSSStyleDeclaration} interface that allows for optional values.
 * That also can be set as a string. This is to match the pattern angular uses for NgStyle.
 * 
 * @todo add ability to have apply conditional logic to the values
 */
export type NgStyleValues = BaseStyleValues | string;

export interface WSStyleValuesMods {
    customVar?: string;
}

export type WSStyleBlockMod = ModdableType<BaseStyleValues, WSStyleValuesMods>;

export type WSStyleBlockProperty = WSStyleBlockMod[keyof WSStyleBlockMod];


export interface WSStyleBlock extends WSStyleBlockMod {
    [key: string]: WSStyleBlockProperty
    
}
/* export interface WSStyleBlock {
    [key: WSStyleBlockMod]: string;
} */
export interface WSStyleFunction {
    name: string;
    functionCall: GeneralFunction<unknown>;
    args?: TypedContainer<unknown>;
}

export type WSStyleSheetBlock = WSStyleBlock | WSStyleSheet | WSStyleFunction | WSParams;

export interface WSSeparatedStyleBlock {
    properties: WSStyleBlock;
    functions: TypedContainer<WSStyleFunction>;
    selectors: WSStyleSheet; // either WSStyleSheet or TypedContainer<WSSS>
}

export type WSStyleProperty = WSStyleSheetBlock | string;
/**
 * Representation of a CSS stylesheet. The keys represent selectors, and the values represent the style block for
 * that selector.
 */
export interface WSStyleSheet {
    [key: string]: WSStyleSheetBlock;
}

export interface RegisteredStyleSheet {
    index: number;
    id: string;
    styleSheet: WSStyleSheet;
}

/**
 * This is a helper interface to define the structure of the StyleManagerAction.
 */
export type StyleManagerAction = 'remainder' | 'remainder-full' | 'remainder-full-all' | 'root' | 'subtract' | 'subtract-padding' | 'set-client' | 'remainder-all';

/**
 * This is a helper interface to define the structure of the HTMLStructure object.
 *
 * @description The idea here is to be able to set a programmatic definition to apply structural styles.
 * The intent being to keep a running exact tally of the current available page height left to render
 * elements.
 *
 * So, initially we'd enter into pageLayout, it wouldn't have any properties to apply, and so would
 * just assign the pageLayout element's values to the template object, then recursively run through
 * each of its children.
 *
 * Each of those in turn would have settings to configure, primarily height atm, and would then run
 * the function on each of their children.
 *
 * The idea being that we can then set the height of each element to the height of the parent, minus
 * the height of the children, and then set the height of the children to the height of the parent,
 * minus the height of the children, and so on.
 *
 * action - This is the action to apply to the element. The options are:
 * - remainder - This will set the height of the element to the remainder of the parent's height
 *      after all other elements have been rendered.
 * - root - This will set the remainder value to the height of the page.
 * - subtract - This will subtract the height of the element from the remainder value.
 * - subtract-padding - This will subtract the padding of the element from the remainder value.
 * - set-client - This will set the remainder value to the clientHeight of the element.
 * - remainder-all - This will set the height of all elements matching the querySelector to the remainder value.
 * - remainder-full - This will set the height of the element to the remainder value, and set the height to 100%.
 * - remainder-full-all - This will set the height of all elements matching the querySelector to the remainder value,
 *      and set the height to 100%.
 *
 * querySelector - This is the querySelector to use to find the element to apply the action to.
 *
 * children - This is an array of HTMLStructure objects to apply the action to.
 *
 * @export
 * @interface HTMLStructure
 * @since 1.0.0
 * @version 1.0.0
 *
 * @example
 *
 * const templateStructure: HTMLStructure = {
 *     action: 'root',
 *     querySelector: '.app-body',
 *     children: [
 *         {
 *              querySelector: '.app-nav-bar',
 *              action: 'subtract'
 *         },
 *         {
 *             querySelector: '.page-layout__content',
 *             action: 'remainder',
 *             children: [
 *                 {
 *                     querySelector: '.top-nav',
 *                     action: 'subtract'
 *                 },
 *                 {
 *                     querySelector: '.p-tabview',
 *                     action: 'remainder',
 *                     children: [
 *                         {
 *                             querySelector: '.roster-list-inner',
 *                             action: 'set-client',
 *                             children: [
 *                                 {
 *                                     querySelector: '.p-panel-header',
 *                                     action: 'subtract'
 *                                 },
 *                                 {
 *                                     querySelector: '.p-toggleable-content',
 *                                     action: 'remainder',
 *                                 }
 *                             ]
 *                         }
 *                     ]
 *                 }
 *             ]
 *         }
 *     ]
 * };
 */
export interface HTMLStructure {
    action: StyleManagerAction;
    index?: number;
    querySelector: string;
    children?: HTMLStructure[];
}

export interface RegisteredHTMLStructure {
    id: string;
    structure: HTMLStructure;
}

/**
 * This is a helper interface to define a mapping of HTML Element objects
 */
export interface HTMLElementMap {
    [key: string]: HTMLElement;
}