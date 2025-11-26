import { Pipe, PipeTransform } from '@angular/core';

export const fibonnaci = (n: number): number => {
  if (n==1 || n==0) {
    return 1;
  }
  return fibonnaci(n-1) + fibonnaci(n-2);
}

@Pipe({
  name: 'fibonacci',
  standalone: true
})
export class FibonacciPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    console.log("FibonacciPipe called with ", value);
    return fibonnaci(value);
  }

}
