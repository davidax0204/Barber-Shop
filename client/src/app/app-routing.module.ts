import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReverseAuthGuard } from 'src/guards/reverse-auth.guard';
import { AppointmentsComponent } from './appointments/appointments.component';
import { BookComponent } from './book/book.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ReverseAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [ReverseAuthGuard],
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'book',
        component: BookComponent,
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'appointment/edit',
        component: EditAppointmentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
