import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
}
