import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';
import { BookingManagerComponent } from './pages/booking-manager/booking-manager.component';
import { CustomerManagerComponent } from './pages/customer-manager/customer-manager.component';
import { RoomManagerComponent } from './pages/room-manager/room-manager.component';
import { ProfileManagerComponent } from './pages/profile-manager/profile-manager.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { BookingReaderComponent } from './pages/booking-reader/booking-reader.component';
import { CustomerReaderComponent } from './pages/customer-reader/customer-reader.component';
import { RoomReaderComponent } from './pages/room-reader/room-reader.component';
import { UserManagerComponent } from './pages/user-manager/user-manager.component';
import { AuthenticacionLayoutComponent } from './pages/authenticacion-layout/authenticacion-layout.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { ForgotPasswordFormComponent } from './pages/forgot-password-form/forgot-password-form.component';
import { ResetPasswordFormComponent } from './pages/reset-password-form/reset-password-form.component';
import { HasRoleGuard } from './guards/has-role.guard';
import { RoomTypeManagerComponent } from './pages/room-type-manager/room-type-manager.component';
import { RoomTypeReaderComponent } from './pages/room-type-reader/room-type-reader.component';
import { AvailableRoomsComponent } from './bookingPages/available-rooms/available-rooms.component';
import { RoomInfoComponent } from './bookingPages/room-info/room-info.component';
import { PaymentComponent } from './bookingPages/payment/payment.component';

const routes: Routes = [
  {
    path:'Dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'Resumen',
        component: SummaryComponent
      },
      {
        path: 'RegistrarReservas',
        component: BookingManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin','editor'],
        },
      },
      {
        path: 'RegistrarClientes',
        component: CustomerManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin','editor'],
        }
      },
      {
        path: 'RegistrarHabitaciones',
        component: RoomManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin','editor'],
        }
      },
      {
        path: 'RegistrarHTipos',
        component: RoomTypeManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin','editor'],
        }
      },
      {
        path: 'MiPerfil',
        component: ProfileManagerComponent
      },
      {
        path: 'ConsultarReservas',
        component: BookingReaderComponent
      },
      {
        path: 'ConsultarClientes',
        component: CustomerReaderComponent
      },
      {
        path: 'ConsultarHabitaciones',
        component: RoomReaderComponent
      },
      {
        path: 'ConsultarHTipos',
        component: RoomTypeReaderComponent
      },
      {
        path: 'AdministrarUsuarios',
        component: UserManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin']
        }
      },
      {
        path: 'ActualizarReservas/:bookingId',
        component: BookingManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin','editor'],
        },
      },
      {
        path: 'ActualizarClientes/:customerId',
        component: CustomerManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin','editor'],
        }
      },
      {
        path: 'ActualizarHabitaciones/:roomId',
        component: RoomManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin'],
        }
      },
      {
        path: 'ActualizarHTipos/:roomTypeId',
        component: RoomTypeManagerComponent,
        canActivate: [HasRoleGuard],
        data: {
          roles: ['admin'],
        }
      },
    ]
  },
  {
    path: '',
    component: AuthenticacionLayoutComponent,
    children: [
      {
        path: '',
        component: LoginFormComponent
      },
      {
        path: 'Olvidar',
        component: ForgotPasswordFormComponent
      },
      {
        path: 'RecuperarContrasena/:token',
        component: ResetPasswordFormComponent
      },
    ]
  },
  {
    path: 'Reservar',
    component: AvailableRoomsComponent
  },
  {
    path: 'Habitacion/:roomId',
    component: RoomInfoComponent
  },
  {
    path: 'Pagar',
    component: PaymentComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
