import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {User, UsersService} from "../users.service";
import {lastRender} from "../last-render";
import * as ChartJs from 'chart.js/auto';
import { UserListComponent } from '../user-list/user-list.component';
import { USER_CLUSTERS } from '../const/user-cluster.constant';
@Component({
  imports: [UserListComponent],
  standalone: true,
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhComponent implements OnInit {
  oddUsers: User[];
  evenUsers: User[];
  chart: any;
  USER_CLUSTERS = USER_CLUSTERS;
  private cdr = inject(ChangeDetectorRef);
  private userService = inject(UsersService);
  constructor() {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }

  ngOnInit(): void {
        this.createChart();
        this.userService.bossUser$.subscribe((newBossUser) => {
          this.evenUsers = this.userService.addUser(this.evenUsers, newBossUser.name);
          this.cdr.markForCheck();
          this.updateChart();
        });
        this.userService.workerUser$.subscribe((newWorkerUser) => {
          this.oddUsers = this.userService.addUser(this.oddUsers, newWorkerUser.name);
          this.cdr.markForCheck();
          this.updateChart();
        });
    }
  
  
  lastRender(): string {
    return lastRender();
  }
  
  createChart(){
    const data = [
      { users: 'Workers', count: this.oddUsers.length },
      { users: 'Boss', count: this.evenUsers.length },
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
      this.oddUsers.length,
      this.evenUsers.length
    ];
    this.chart.update();
  }
}
