import { ElementConfig } from '@app/models';

export class DomEventManager {

    constructor(
        public element: HTMLElement,
        public config: ElementConfig,
    ) {
        
    }
}