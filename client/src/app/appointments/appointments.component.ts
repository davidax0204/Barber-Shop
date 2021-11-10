import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { Appointment } from 'src/models/Appointment';
import { User } from 'src/models/user';
import { BarberService } from 'src/services/barber.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  heroes = [];
  appointmentsSub: Subscription;
  appointments: Appointment[] = [];
  user: User = JSON.parse(localStorage.getItem('user'));
  name;
  dateTo;
  dateFrom;

  constructor(
    private toastr: ToastrService,
    public barberService: BarberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy() {
    this.appointmentsSub.unsubscribe();
  }

  loadAppointments() {
    this.barberService.getAppointments().subscribe();
    this.appointmentsSub = this.barberService.selectedDayTakentimes$.subscribe(
      (appointments: Appointment[]) => {
        this.appointments = appointments;
        console.log(this.appointments);
      }
    );
  }
  edit(id: number) {
    // this.heroService.powerUp(name).subscribe(() => {
    //   this.toastr.success(`${name} was successfully powered up!`);
    // });
  }

  delete(id: number) {
    this.barberService.delete(id).subscribe(() => {
      this.toastr.success('You have succesfully deleted the appointment');
    });
  }

  selectAppointment(id: number) {
    this.barberService.getAppointment(id).subscribe(() => {
      this.router.navigateByUrl('/appointment/edit');
    });
  }

  mine(userName: string) {
    if (userName == this.user.userName) {
      return true;
    }
    return false;
  }

  search() {
    var fromDate;
    var toDate;
    var orderByName;

    if (this.dateFrom) {
      fromDate = moment(this.dateFrom).format('YYYY-MM-DDTHH:mm');
    } else {
      fromDate = moment('2000-01-01').format('YYYY-MM-DDTHH:mm');
    }

    if (this.dateTo) {
      toDate = moment(this.dateTo).format('YYYY-MM-DDTHH:mm');
    } else {
      toDate = moment('2090-01-01').format('YYYY-MM-DDTHH:mm');
    }

    if (this.name) {
      orderByName = this.name;
    } else {
      orderByName = 'all';
    }

    this.barberService
      .getAppointmentsByName(orderByName, fromDate, toDate)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
