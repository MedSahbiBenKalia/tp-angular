import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { User } from '../users.service';
import { lastRender } from '../last-render';
import { FibonacciPipe } from '../pipes/fibonacci.pipe';


@Component({
  imports: [FibonacciPipe],
  selector: 'app-user-item',
  standalone: true,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserItemComponent {

  @Input({required : true}) user! : User;
  lastRender(): string {
    return lastRender();
  }
}
