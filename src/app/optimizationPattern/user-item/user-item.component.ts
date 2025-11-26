import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { User } from '../users.service';




@Component({
  selector: 'app-user-item',
  standalone: false,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserItemComponent {

  @Input({required : true}) user! : User;
}
