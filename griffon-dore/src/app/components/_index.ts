import { GENERAL_COMPONENTS } from './general/_index';
import { PAGE_STRUCTURE_COMPONENTS } from './page-structure/_index';

export * from './general/_index';
export * from './page-structure/_index';

export const COMPONENTS = [
    ...PAGE_STRUCTURE_COMPONENTS,
    ...GENERAL_COMPONENTS
];