import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CustomerAndBooking, Payment, RoomType, Transaction } from 'src/app/interfaces/interfaces';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payment.service';
import { BROWSER_LOCAL_STORAGE, BROWSER_SESSION_STORAGE } from 'src/app/services/storage';
import { SWDataService } from 'src/app/services/swdata.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public customerForm!: FormGroup;

  private storageRooms: string | null = this.storage.getItem('rooms');
  private storageDates: string | null = this.storage.getItem('dates');

  public savedDates!: string[];
  public rooms!: any[];
  public roomTypes: RoomType[] = [];
  public subTotals: number[] = [];
  public total: number = 0;

  public setInvoiceData(){
    this.rooms.forEach(async(room) => {
      try{
        let roomType: RoomType = await lastValueFrom(this.swDataService.getRoomType(room.roomType));
        console.log(roomType)
        this.roomTypes.push(roomType)
        let totalAdults = room.numAdults * roomType.price;
        let totalChildren = room.numChildren * (roomType.price/2);
        this.subTotals.push(totalAdults+totalChildren)
      } catch (error) {
        console.log(error)
      } finally{
        this.total = this.subTotals.reduce(
          (accumulator, currentValue) => accumulator + currentValue,0
          );
      }
    });
  }

  public cancelBooking(): void{
    this.storage.clear();
    this.router.navigateByUrl('/Reservar');
  }
  
  public async handleBooking(): Promise<void>{
    if(!this.customerForm.valid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    
    let today: Date = new Date();
    let payment: Payment = {
      Amount: this.total * 100,
      AmountWithoutTax: this.total * 100,
      clientTransactionId: `${today.getTime()}${this.customerForm.value['customerId']}`,
      phoneNumber: this.customerForm.value['phone'],
      countryCode: '593',
      email: this.customerForm.value['email'],
      documentId: this.customerForm.value['customerId']
    }

    let transaction!: Transaction;

    try {
      transaction = await lastValueFrom(this.paymentService.doPayment(payment));
      console.log(transaction.transactionId)
    } catch (error) {
      if(error instanceof HttpErrorResponse){
        console.log(error)
        this.notificationService.defaultNotification('error',`${error.error.message}`)
        return;
      }
    }

    let statusCode = 1;

    statusCode = await this.notificationService.paymentStatus(transaction);
    console.log('El status desde el componente',statusCode)

    if(statusCode == 1){
      return;
    }
    else if(statusCode == 2){
      this.notificationService
        .defaultNotification('error','Se ha cancelado el pago de la reserva')
        .then(() => {
          this.storage.clear();
          this.router.navigateByUrl('/Reservar');
        });
      return;
    }
      
    this.rooms.forEach(room => delete room.roomType);

    let customerAndBooking: CustomerAndBooking = {
      customerId: this.customerForm.value['customerId'],
      name: this.customerForm.value['name'],
      lastname: this.customerForm.value['lastname'],
      phone: this.customerForm.value['phone'],
      email: this.customerForm.value['email'],
      address: this.customerForm.value['address'],
      province: this.customerForm.value['province'],
      checkIn: this.savedDates[0],
      checkOut: this.savedDates[1],
      customer: this.customerForm.value['customerId'],
      state: 'En progreso',
      type: 'En línea',
      rooms: this.rooms,
      paymentMethod: 'Payphone',
      discountPercentage: 0,
      totalPrice: this.total
    }
    console.log(customerAndBooking)
    
    try {
      await lastValueFrom(this.swDataService.addCustomerAndBooking(customerAndBooking))
    } catch (error) {
      console.log(error);
      this.notificationService
        .defaultNotification('error','Ocurrió un error al registrar la reserva.')
        .then(() => {
          console.log('Error en registro de reserva')
          this.storage.clear();
          this.router.navigateByUrl('/Reservar');
        });
        return;
    }

    this.notificationService
      .defaultNotification('success','Tu reserva ha sido confirmado. Gracias por elegirnos')
      .then(() =>{
        this.router.navigateByUrl('/Reservar');
        this.storage.clear();
      })
  }

  constructor(
    @Inject(BROWSER_SESSION_STORAGE) private storage: Storage,
    private swDataService: SWDataService,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!this.storageRooms || !this.storageDates){
      this.router.navigateByUrl('/Reservar');
      return;
    }

    this.savedDates = JSON.parse(this.storageDates);
    this.rooms = JSON.parse(this.storageRooms);
    this.setInvoiceData();
    this.customerForm = new FormGroup({
      customerId: new FormControl('',[Validators.required]),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      phone: new FormControl('',[Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email]),
      address: new FormControl('', Validators.required),
      province: new FormControl('', Validators.required)
    });
  }

}
