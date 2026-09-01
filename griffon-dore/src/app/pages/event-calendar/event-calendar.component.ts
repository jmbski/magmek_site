import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gdo-event-calendar',
  standalone: true,
  imports: [],
  templateUrl: './event-calendar.component.html',
  styleUrl: './event-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCalendarComponent {

}
