import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BarberService {
  // private currentUserSource = new BehaviorSubject<User>(null);
  // currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  setAppointment(appointment) {
    
    return this.http.post(environment.apiUrl + 'barber/' + appointment, {});
  }
}
