import { Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';
import { BehaviorSubject, Subject } from 'rxjs';
export interface User {
  name: string,
  age: number
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #workerUserSubject ;
  workerUser$ ;

  #bossUserSubject ; 
  bossUser$ ;


  users: User [] = [];
  constructor() {
    for (let i = 0; i<50; i++)
      this.users.push({
        name: faker.name.fullName(),
        age: faker.datatype.number({min: 18, max: 30})
      });

    this.#bossUserSubject = new BehaviorSubject<User[]>(this.getOddOrEven());
    this.bossUser$ = this.#bossUserSubject.asObservable();

    this.#workerUserSubject = new BehaviorSubject<User[]>(this.getOddOrEven(true));
    this.workerUser$ = this.#workerUserSubject.asObservable();

  }
  private getOddOrEven(isOdd = false): User[] {
    return this.users.filter((user) => !!(user.age % 2) == isOdd );
  }
  
  addbossUser(name: string) {
    const newBossUser = {
      name,
      age: faker.datatype.number({min: 18, max: 30})
    };
    this.#bossUserSubject.next([newBossUser]);
  }
  addworkerUser(name: string) {
    const newWorkerUser = {
      name,
      age: faker.datatype.number({min: 18, max: 30})
    };
    this.#workerUserSubject.next([newWorkerUser]);
  }

}
