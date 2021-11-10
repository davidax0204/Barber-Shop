import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from 'src/models/Appointment';
import { TakenAppointment } from 'src/models/takenAppointment';
import { BarberService } from 'src/services/barber.service';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css'],
})
export class EditAppointmentComponent implements OnInit {
  hours: any[] = [];
  bookAppointmentForm: FormGroup;
  date;
  time;
  takenTimes: TakenAppointment[];
  activeAppointment: Appointment;

  showTime = false;
  isModalOpen = false;
  signInErrorMessage;

  constructor(
    private fb: FormBuilder,
    private barberService: BarberService,
    private toastr: ToastrService,
    private router:Router
  ) {
    this.bookAppointmentForm = this.fb.group({
      date: [
        '',
        [Validators.required, this.weekendValidator, this.pastDateValidator],
      ],
      time: ['', [Validators.required]],
    });

    this.date = this.bookAppointmentForm.get('date');
    this.time = this.bookAppointmentForm.get('time');
  }

  handler(e) {
    this.showTime = true;
    let selectedDate = new Date(e.target.value);
    this.hours = [];
    this.getTakenAppointment(selectedDate, e);
  }

  async getTakenAppointment(selectedDate, e) {
    var time = moment(selectedDate).format('YYYY-MM-DDTHH:mm');

    this.barberService
      .getSelectedDayAppointments(time)
      .subscribe((takenTimes: TakenAppointment[]) => {
        let selectedDate = new Date(e.target.value);
        let date = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getUTCDate(),
          9,
          0
        );

        for (let i = 0; i < 15; i++) {
          date = this.addMinutes(date, 30);
          var flag = false;

          takenTimes.forEach((appointmentnDate) => {
            let item = moment(appointmentnDate.appointmentnDate).format(
              'YYYY-MM-DDTHH:mm'
            );
            let dateformat = moment(date).format('YYYY-MM-DDTHH:mm');
            if (item == dateformat) {
              flag = true;
            }
          });

          if (flag) {
            continue;
          }

          this.hours.push(date);
        }

        this.takenTimes = takenTimes;
      });
  }

  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  ngOnInit(): void {
    this.barberService.currentAppointment$.subscribe((appointment) => {
      this.activeAppointment = appointment;
      console.log(this.activeAppointment);
    });
  }

  invalidDateMessage() {
    if (this.date.errors?.required) {
      return 'You must enter an date';
    }
    if (this.date.errors?.weekend) {
      return 'The barber shop is closed on the weekend';
    }
    if (this.date.errors?.invalidPastDate) {
      return 'Please select a valid date';
    }
  }

  invalidTime() {
    if (this.time.errors?.required) {
      return 'You must enter a time';
    }
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  weekendValidator(control: AbstractControl): ValidationErrors | null {
    var date: Date = new Date(control.value);
    var dayOfTheWeek = date.getDay();
    var error = false;

    if (dayOfTheWeek == 5 || dayOfTheWeek == 6) {
      error = true;
    }
    return error ? { weekend: true } : null;
  }

  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    var date: Date = new Date(control.value);
    var now = new Date();
    return now >= date ? { invalidPastDate: true } : null;
  }

  onSubmitbookAppointmentForm() {
    this.isModalOpen = true;
  }

  confirm() {
    var time = moment(String(this.time.value)).format('YYYY-MM-DDTHH:mm');

    this.barberService.edit(this.activeAppointment.id, time).subscribe(() => {
      this.toastr.success('You have succesfully edited your appointment');
      this.router.navigateByUrl('/appointments');
    });
  }
}
