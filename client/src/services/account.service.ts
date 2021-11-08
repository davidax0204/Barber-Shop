import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  register(model: any) {
    return this.http
      .post<User>(environment.apiUrl + 'account/register', model)
      .pipe(
        map((user) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  login(model: any) {
    return this.http
      .post<User>(environment.apiUrl + 'account/login', model)
      .pipe(
        map((user) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }
  update(model: any) {
    return this.http
      .put<User>(environment.apiUrl + 'account/update', model)
      .pipe(
        map((user) => {
          this.setCurrentUser(user);
        })
      );
  }

  logOut() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  setCurrentUser(user?: User) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user) {
      this.currentUserSource.next(user);
    }
  }
}
