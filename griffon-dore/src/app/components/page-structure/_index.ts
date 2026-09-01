import { BlockableUiComponent } from './blockable-ui/blockable-ui.component';
import { ElementRendererComponent } from './element-renderer/element-renderer.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { PageTemplateComponent } from './page-template/page-template.component';
import { TopNavComponent } from './top-nav/top-nav.component';

export * from './blockable-ui/blockable-ui.component';
export * from './element-renderer/element-renderer.component';
export * from './page-layout/page-layout.component';
export * from './page-template/page-template.component';
export * from './top-nav/top-nav.component';

export const PAGE_STRUCTURE_COMPONENTS = [
    BlockableUiComponent,
    ElementRendererComponent,
    PageLayoutComponent,
    PageTemplateComponent,
    TopNavComponent,
];