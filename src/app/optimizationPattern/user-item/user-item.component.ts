import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { User } from '../users.service';

export const fibonnaci = (n: number): number => {
  if (n==1 || n==0) {
    return 1;
  }
  return fibonnaci(n-1) + fibonnaci(n-2);
}


@Component({
  selector: 'app-user-item',
  standalone: false,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserItemComponent {

  @Input({required : true}) user! : User;

  fibo(n: number): number {
    const fib = fibonnaci(n);
    console.log({n, fib});

    return fib;
  }
}
