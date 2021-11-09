import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/services/account.service';
import { BarberService } from 'src/services/barber.service';
import * as moment from 'moment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  hours: any[] = [];
  bookAppointmentForm: FormGroup;
  date;
  time;

  showTime = false;
  isModalOpen = false;
  signInErrorMessage;

  constructor(
    private fb: FormBuilder,
    private barberService: BarberService,
    private toastr: ToastrService
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

    var dateString = e.target.value;
    let newDate = new Date(dateString);
    let date = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getUTCDate(),
      9,
      0
    );
    this.hours = [];

    this.hours.push(date);

    for (let i = 0; i < 15; i++) {
      date = this.addMinutes(date, 30);
      this.hours.push(date);
    }

    /// get server date
    // create hours
  }

  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  ngOnInit(): void {}

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
    this.barberService.setAppointment(time).subscribe(() => {
      this.toastr.success('The appointment was scheduled successfully');
    });
    this.isModalOpen = false;
    this.bookAppointmentForm.reset();
  }
}
