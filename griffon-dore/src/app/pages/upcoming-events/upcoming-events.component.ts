import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gdo-upcoming-events',
  standalone: true,
  imports: [],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingEventsComponent {

}
