import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gdo-members',
  standalone: true,
  imports: [],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent {

}
