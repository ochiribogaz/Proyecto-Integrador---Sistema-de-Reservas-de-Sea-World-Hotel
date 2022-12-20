/* This file is the central point of the Angular module. It's where all of the components are brought together. */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FrameworkComponent } from './pages/framework/framework.component';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
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
import { ResetPasswordFormComponent } from './pages/reset-password-form/reset-password-form.component';
import { ForgotPasswordFormComponent } from './pages/forgot-password-form/forgot-password-form.component';
import { RoomTypeReaderComponent } from './pages/room-type-reader/room-type-reader.component';
import { RoomTypeManagerComponent } from './pages/room-type-manager/room-type-manager.component';
import { AvailableRoomsComponent } from './bookingPages/available-rooms/available-rooms.component';
import { RoomInfoComponent } from './bookingPages/room-info/room-info.component';
import { PaymentComponent } from './bookingPages/payment/payment.component';


@NgModule({
  declarations: [
    FrameworkComponent,
    DashboardLayoutComponent,
    BookingManagerComponent,
    RoomManagerComponent,
    CustomerManagerComponent,
    ProfileManagerComponent,
    SummaryComponent,
    BookingReaderComponent,
    CustomerReaderComponent,
    RoomReaderComponent,
    UserManagerComponent,
    AuthenticacionLayoutComponent,
    LoginFormComponent,
    ResetPasswordFormComponent,
    ForgotPasswordFormComponent,
    RoomTypeReaderComponent,
    RoomTypeManagerComponent,
    AvailableRoomsComponent,
    RoomInfoComponent,
    PaymentComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue :'/BookingAdmin'}],
  bootstrap: [FrameworkComponent]
})
export class AppModule { }
