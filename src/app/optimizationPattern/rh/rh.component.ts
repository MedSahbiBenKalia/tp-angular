import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {User, UsersService} from "../users.service";
import {lastRender} from "../last-render";
import * as ChartJs from 'chart.js/auto';
import { UserListComponent } from '../user-list/user-list.component';
import { USER_CLUSTERS } from '../const/user-cluster.constant';
import { Observable, scan, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  imports: [UserListComponent , AsyncPipe],
  standalone: true,
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhComponent implements OnInit {
  oddUsers$ : Observable<User[]>;
  evenUsers$ : Observable<User[]>;
  oddUsersLength: number = 0;
  evenUsersLength: number = 0;
  chart: any;
  USER_CLUSTERS = USER_CLUSTERS;
  private cdr = inject(ChangeDetectorRef);
  private userService = inject(UsersService);
  constructor() {
    this.oddUsers$ = this.userService.workerUser$.pipe(
      scan((acc : User[], curr: User[]) => [...curr, ...acc], []),
      tap((users : User[]) => {
        this.oddUsersLength = users.length;
        this.updateChart();
      })
    );
    this.evenUsers$ = this.userService.bossUser$.pipe(
      scan((acc : User[], curr: User[]) => [...curr, ...acc], []),
      tap((users : User[]) => {
        this.evenUsersLength = users.length;
        this.updateChart();
      })
    );

    

  }

  ngOnInit(): void {
        this.createChart();
    }
  
  
  lastRender(): string {
    return lastRender();
  }
  
  createChart(){
    const data = [
      { users: 'Workers', count: this.oddUsersLength },
      { users: 'Boss', count: this.evenUsersLength },
    ];
    this.chart = new ChartJs.Chart("MyChart",
    {
      type: 'bar',
        data: {
          labels: data.map(row => row.users),
        datasets: [
        {
          label: 'Entreprise stats',
          data: data.map(row => row.count)
        }
      ]
    }
    });
  }
  updateChart(){
    this.chart.data.datasets[0].data = [
      this.oddUsersLength,
      this.evenUsersLength
    ];
    this.chart.update();
  }
}
