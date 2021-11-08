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
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.bookAppointmentForm = this.fb.group({
      date: ['', [Validators.required, this.weekendValidator]],
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
  }

  invalidTime() {
    if (this.time.errors?.required) {
      return 'You must enter a time';
    }
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  // weekendValidator(control: FormGroup): ValidationErrors | null {
  //   debugger;
  //   const selectedDate = control.get('date').value;
  //   var date = Date.parse(selectedDate);

  //   return true ? { invalidEndDate: true } : null;
  // }

  weekendValidator(control: AbstractControl): ValidationErrors | null {
    // debugger;
    var date: Date = new Date(control.value);
    var dayOfTheWeek = date.getDay();
    var error = false;

    if (dayOfTheWeek == 5 || dayOfTheWeek == 6) {
      error = true;
      this.showTime = false;
    }
    return error ? { weekend: true } : null;
  }

  onSubmitbookAppointmentForm() {
    console.log(this.bookAppointmentForm.value);

    // debugger;
    // var date = new Date(this.date.value);

    // var time = new Date();

    // console.log(Date.parse(this.time.value[0]));
  }
}
