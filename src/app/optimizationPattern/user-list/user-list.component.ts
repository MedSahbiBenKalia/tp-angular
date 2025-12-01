import {Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, inject, ElementRef, OnInit} from '@angular/core';
import {User, UsersService} from "../users.service";
import { fromEvent  } from 'rxjs';
import { lastRender } from '../last-render';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserItemComponent } from '../user-item/user-item.component';
import { USER_CLUSTERS } from '../const/user-cluster.constant';



@Component({
  imports: [UserItemComponent],
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  private userService = inject(UsersService);
  private host = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  @Input({required : true}) usersCluster: string = '';
  @Input() users: User[] = [];
  userFullName: string = '';

  constructor() {
    fromEvent<Event>(this.host.nativeElement, 'input')
    .pipe(
      takeUntilDestroyed()
    )
    .subscribe((event : Event) => {
      const inputElement = event.target as HTMLInputElement;
      const oldValue = this.userFullName;  
      this.userFullName = inputElement.value;
      if(((oldValue.trim().length > 0) !== (this.userFullName.trim().length > 0))) {this.cdr.detectChanges();} 
    });


    fromEvent<Event>(this.host.nativeElement, 'click')
    .pipe(takeUntilDestroyed())
    .subscribe((event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element is the add button
      if(target.tagName === 'BUTTON' || target.closest('button')) {
        if(!this.userFullName.trim()) return;
        
        if(this.usersCluster === USER_CLUSTERS.BOSS) {
          this.userService.addbossUser(this.userFullName.trim());
        } else if (this.usersCluster === USER_CLUSTERS.WORKERS) {
          this.userService.addworkerUser(this.userFullName.trim());
        }
        this.userFullName = '';
      }
    });



  }

  lastRender(): string {
    return lastRender();
  }
}


