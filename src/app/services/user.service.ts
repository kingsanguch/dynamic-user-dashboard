import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: any;
  company?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localUrl = 'assets/users.json';
  private storageKey = 'users'; // Key for localStorage

  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(public http: HttpClient) {}

  // Load initial users: from localStorage if available, else from JSON file
  public loadUsers(): void {
    const localData = localStorage.getItem(this.storageKey);
    if (localData) {
      try {
        const users = JSON.parse(localData);
        this.usersSubject.next(users);
      } catch (e) {
        console.error('Error parsing localStorage data', e);
        this.loadFromJson();
      }
    } else {
      this.loadFromJson();
    }
  }

  // Helper: load users from the JSON file and store in localStorage
  private loadFromJson(): void {
    this.http.get<User[]>(this.localUrl).subscribe(users => {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      this.usersSubject.next(users);
    });
  }

  // Update localStorage with the current users
  private updateLocalStorage(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  public getUsers(): Observable<User[]> {
    return this.users$;
  }

  public addUser(user: User): void {
    const currentUsers = this.usersSubject.value;
    const newUser = { ...user, id: currentUsers.length + 1 };
    const updatedUsers = [...currentUsers, newUser];
    this.usersSubject.next(updatedUsers);
    this.updateLocalStorage(updatedUsers);
  }

  public deleteUser(id: number): void {
    const updated = this.usersSubject.value.filter(u => u.id !== id);
    this.usersSubject.next(updated);
    this.updateLocalStorage(updated);
  }

  public updateUser(updatedUser: User): void {
    const updated = this.usersSubject.value.map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );
    this.usersSubject.next(updated);
    this.updateLocalStorage(updated);
  }
}
