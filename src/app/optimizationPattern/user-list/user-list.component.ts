import {Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, inject, ElementRef, OnInit} from '@angular/core';
import {User} from "../users.service";
import { fromEvent  } from 'rxjs';
import { lastRender } from '../last-render';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserItemComponent } from '../user-item/user-item.component';


@Component({
  imports: [UserItemComponent],
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  private host = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  @Input() usersCluster: string = '';
  @Input() users: User[] = [];
  @Output() add = new EventEmitter<string>();
  userFullName: string = '';
  addUser() {
    this.add.emit(this.userFullName);
    this.userFullName = '';
  }

  constructor() {
    fromEvent<Event>(this.host.nativeElement, 'input')
    .pipe(
      takeUntilDestroyed()
    )
    .subscribe((event : Event) => {
      const inputElement = event.target as HTMLInputElement;
      const oldValue = this.userFullName;  
      this.userFullName = inputElement.value;
        if(!(oldValue.length * this.userFullName.length)) {this.cdr.detectChanges();} 
    });
  }

  lastRender(): string {
    return lastRender();
  }
}


