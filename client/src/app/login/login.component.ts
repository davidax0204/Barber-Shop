import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  email;
  password;

  isModalOpen = false;
  signInErrorMessage;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.email = this.signInForm.get('email');
    this.password = this.signInForm.get('password');
  }

  ngOnInit(): void {}

  invalidEmailMessage() {
    if (this.email.errors?.required) {
      return 'You must enter an Email';
    }
    if (this.email.errors?.email) {
      return 'You must enter a valid Email';
    }
  }

  invalidPassword() {
    if (this.password.errors?.required) {
      return 'You must enter a password';
    }
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  onSubmitSignInForm() {
    this.accountService.login(this.signInForm.value).subscribe(() => {
      this.router.navigateByUrl('/profile');
      this.toastr.success('Successfully logged in');
    });
  }
}
