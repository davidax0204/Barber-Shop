import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Appointment } from 'src/models/Appointment';
import { TakenAppointment } from 'src/models/takenAppointment';

@Injectable({
  providedIn: 'root',
})
export class BarberService {
  // private selectedDayTakentimes = new BehaviorSubject<TakenAppointment[]>(null);
  // selectedDayTakentimes$ = this.selectedDayTakentimes.asObservable();

  private appointments = new BehaviorSubject<Appointment[]>(null);
  selectedDayTakentimes$ = this.appointments.asObservable();

  private currentAppointment = new BehaviorSubject<Appointment>(null);
  currentAppointment$ = this.currentAppointment.asObservable();

  constructor(private http: HttpClient) {}

  setAppointment(appointment) {
    return this.http.post(environment.apiUrl + 'barber/' + appointment, {});
  }

  getSelectedDayAppointments(day) {
    return this.http.get(environment.apiUrl + 'barber/' + day);
  }

  getAppointments() {
    return this.http.get<Appointment[]>(environment.apiUrl + 'barber/').pipe(
      map((appointments) => {
        this.appointments.next(appointments);
      })
    );
  }

  delete(id: number) {
    return this.http
      .delete<Appointment[]>(environment.apiUrl + 'barber/' + id)
      .pipe(
        map((appointments) => {
          this.appointments.next(appointments);
        })
      );
  }

  getAppointment(id: number) {
    return this.http
      .get<Appointment>(environment.apiUrl + 'barber/edit/' + id)
      .pipe(
        map((appointment) => {
          debugger;
          this.currentAppointment.next(appointment);
        })
      );
  }

  edit(id: number, day) {
    debugger;
    return this.http
      .put<Appointment[]>(
        environment.apiUrl + 'barber/edit/' + id + '/' + day,
        {}
      )
      .pipe(
        map((res) => {
          console.log(res);
        })
      );
  }
}
