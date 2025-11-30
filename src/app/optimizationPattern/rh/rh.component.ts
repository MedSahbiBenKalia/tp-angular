import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {User, UsersService} from "../users.service";
import {lastRender} from "../last-render";
import * as ChartJs from 'chart.js/auto';
@Component({
  standalone: false,
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhComponent implements OnInit {
  oddUsers: User[];
  evenUsers: User[];
  chart: any;
  constructor(private userService: UsersService) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }

  ngOnInit(): void {
        this.createChart();
    }
  addUser(list: User[], newUser: string) {
    this.userService.addUser(list, newUser);

    this.chart.data.datasets[0].data = [
      this.oddUsers.length,
      this.evenUsers.length
    ];

    this.chart.update();

    /*
    if (list === this.oddUsers) {
      this.oddUsers = this.userService.addUser(this.oddUsers, newUser);
    } else if (list === this.evenUsers) {
      this.evenUsers = this.userService.addUser(this.evenUsers, newUser);
    }
      this.cdr.markForCheck(); //zeyda markforcheck pour 2 reson(1-fils mye3ou 7atou durty
                                                                 2-3ana handled event fel parent)
    */
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
}
