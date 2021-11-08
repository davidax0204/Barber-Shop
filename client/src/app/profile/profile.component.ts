import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from 'src/models/user';
import { UpdateUser } from 'src/models/userUpdate';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userSub: Subscription;
  activeUser: User;

  profilePage: FormGroup;
  email;
  password;
  passwordRepeated;

  passwordPage: FormGroup;
  currentPassword;

  isModalOpen = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.profilePage = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', this.passwordValidator],
        passwordRepeated: [''],
      },
      {
        validators: this.passwordRepeatedValidator,
      }
    );

    this.passwordPage = this.formBuilder.group({
      currentPassword: [
        '',
        [Validators.required, this.currentPasswordValidator],
      ],
    });

    this.email = this.profilePage.get('email');
    this.password = this.profilePage.get('password');
    this.passwordRepeated = this.profilePage.get('passwordRepeated');
    this.currentPassword = this.passwordPage.get('currentPassword');
  }

  ngOnInit(): void {
    this.userSub = this.accountService.currentUser$.subscribe((user) => {
      this.activeUser = user;
      if (user) {
        this.profilePage.controls['email'].setValue(this.activeUser.email);
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  invalidEmailMessage() {
    if (this.email.errors?.required) {
      return 'You must enter an Email';
    }
    if (this.email.errors?.email) {
      return 'You must enter a valid Email';
    }
  }

  invalidPassword() {
    if (this.password.errors?.passwordinvalid) {
      return 'A password must contain digits and no spaces';
    }
  }

  invalidPsswordRepeatedMessage() {
    if (this.passwordRepeated.errors?.required) {
      return 'You must repeat on the password';
    }

    if (this.profilePage.errors?.passwordnotrepeated) {
      return 'Two passwords must be identical.';
    }
  }

  invalidCurrentPassword() {
    if (this.currentPassword.errors?.required) {
      return 'You must verify your password';
    }
    if (this.currentPassword.errors?.passwordinvalid) {
      return 'A password must contain digits and no spaces';
    }
  }

  passwordRepeatedValidator(control: FormGroup): ValidationErrors | null {
    const password = control.get('password').value;
    const passwordRepeated = control.get('passwordRepeated').value;
    return password !== passwordRepeated ? { passwordnotrepeated: true } : null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    if (control.value.length === 0) {
      return null;
    }
    const isIncludesWhiteSpace = control.value.includes(' ');
    const isIncludesDigits = /\d/.exec(control.value);
    const invalid = !isIncludesDigits || isIncludesWhiteSpace;
    return invalid ? { passwordinvalid: true } : null;
  }

  currentPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    if (control.value.length === 0) {
      return null;
    }
    const isIncludesWhiteSpace = control.value.includes(' ');
    const isIncludesDigits = /\d/.exec(control.value);
    const invalid = !isIncludesDigits || isIncludesWhiteSpace;
    return invalid ? { passwordinvalid: true } : null;
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  getUserDetails() {
    var user: UpdateUser = {
      userName: this.activeUser.userName,
      email: this.email.value,
      password: this.password.value,
      currentPassword: this.currentPassword.value,
      Token: this.activeUser.token,
    };
    return user;
  }

  onSubmitProfileEditForm() {
    this.isModalOpen = true;
  }

  update() {
    var user = this.getUserDetails();
    this.accountService.update(user).subscribe(() => {
      this.isModalOpen = false;
      this.passwordPage.reset();
      this.profilePage.reset();
      this.profilePage.controls['email'].setValue(this.activeUser.email);
      this.toastr.success('The changes have been made successfully');
    });
  }
}
