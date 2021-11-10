import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TakenAppointment } from 'src/models/takenAppointment';

@Injectable({
  providedIn: 'root',
})
export class BarberService {
  private selectedDayTakentimes = new BehaviorSubject<TakenAppointment[]>(null);
  selectedDayTakentimes$ = this.selectedDayTakentimes.asObservable();

  constructor(private http: HttpClient) {}

  setAppointment(appointment) {
    return this.http.post(environment.apiUrl + 'barber/' + appointment, {});
  }

  getSelectedDayAppointments(day) {
    return this.http.get(environment.apiUrl + 'barber/' + day);
  }
}
