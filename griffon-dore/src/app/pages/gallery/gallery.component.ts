import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gdo-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {

}
