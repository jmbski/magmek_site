
export interface DomEventConfig {
    eventName: string;
    eventData?: unknown;
    eventCallback: (event: Event) => void;

    [key: string]: unknown;
}

export interface ElementConfig {
    selector: string;
    zIndexIncrement?: number;
    hoverZIndexIncrement?: number;
    customEvents?: DomEventConfig[];
    useDefaultHover?: boolean;
    baseElement?: HTMLElement;
    baseZIndexNum?: number;

    [key: string]: unknown;
}