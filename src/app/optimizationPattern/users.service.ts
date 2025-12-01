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
  users: User [] = [];
  constructor() {
    for (let i = 0; i<50; i++)
      this.users.push({
        name: faker.name.fullName(),
        age: faker.datatype.number({min: 18, max: 30})
      });
  }
  getOddOrEven(isOdd = false): User[] {
    return this.users.filter((user) => !!(user.age % 2) == isOdd );
  }
  
  addUser(list: User[], name: string) {
    const newUser = {
      name,
      age: faker.datatype.number({min: 18, max: 30})
    };
    return [newUser, ...list];
  }

  #bossUserSubject = new Subject<User>();
  bossUser$ = this.#bossUserSubject.asObservable();
  addbossUser(name: string) {
    const newBossUser = {
      name,
      age: faker.datatype.number({min: 18, max: 30})
    };
    this.#bossUserSubject.next(newBossUser);
  }

  #workerUserSubject = new Subject<User>();
  workerUser$ = this.#workerUserSubject.asObservable()
  addworkerUser(name: string) {
    const newWorkerUser = {
      name,
      age: faker.datatype.number({min: 18, max: 30})
    };
    this.#workerUserSubject.next(newWorkerUser);
  }

}
