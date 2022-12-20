import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom, Subject } from 'rxjs';
import { Booking, CompleteRoom, Customer, OccupiedRoom } from 'src/app/interfaces/interfaces';
import { DateService } from 'src/app/services/date.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';

declare function customer_select():void;
declare function get_customer():string;

@Component({
  selector: 'app-booking-manager',
  templateUrl: './booking-manager.component.html',
  styleUrls: ['./booking-manager.component.css']
})
export class BookingManagerComponent implements OnInit {

  public bookingForm!: FormGroup;
  public isUpdate: boolean = this.router.url.includes('Actualizar');
  private bookingId: string = this.isUpdate?this.router.url.slice(this.router.url.lastIndexOf('/')+1):'';
  public actionTitle: string = this.isUpdate?'Actualizar':'Registrar';
  public actions: string[] = this.isUpdate? ['Actualización','actualizado']: ['Creación','creado'];
  
  public customers!: Customer[];
  public customer!: string;

  private ocuppiedRooms!: OccupiedRoom[];
  public oRoomsNumbers: Set<number> = new Set();
  public completeRoomInfo: any[] = [];
  public availableUpdateRooms: number[] = [];

  public ciDefaultDate: Date = new Date();
  public coDefaultDate: Date = new Date();
  public ciValue!: string;
  public coValue!: string;

  public rooms: CompleteRoom[] = [];

  private async setCustomers(): Promise<void> {
    try {
      this.customers = await lastValueFrom(this.swDataService.getCustomers());
    } catch (error) {
      this.customers = [];
    }
  }

  private async setRooms(): Promise<void> {
    try {
      this.rooms = await lastValueFrom(this.swDataService.getRooms());
    } catch (error) {
      this.rooms = [];
    } finally{
      this.rooms.forEach(room => this.completeRoomInfo.push({roomInfo: room, subtotal:0, bookingRoom:{room:room.roomNumber,numAdults:0,numChildren:0}}));
    }
  }

  /**
   * * It takes two dates as parameters, and then it sets the ocuppiedRooms property to the result of the
   * * last value from the observable returned by the getOccupiedRooms function of the swDataService
   * * @param {string} checkIn - The check-in date.
   * * @param {string} checkOut - The date the guest is checking out.
   * * @returns A list of rooms that are occupied.
   * */
  private async setOccupiedRooms(checkIn:string, checkOut:string): Promise<void> {
    try {
      this.ocuppiedRooms = await lastValueFrom(this.swDataService.getOccupiedRooms(checkIn,checkOut));
    }
    catch(error) {
      this.ocuppiedRooms = [];
    }
    finally {
      this.oRoomsNumbers.clear();
      if(this.ocuppiedRooms.length == 0){
        return;
      }
      this.ocuppiedRooms.forEach(or => 
        or.rooms.forEach(
          rooms => this.oRoomsNumbers.add(rooms.room)
          )
        );
    }
  }

  public onCheckInChange(event: Event): void{
    let checkInInput = (event.target as HTMLInputElement);
    let checkInDate = new Date(Date.parse(checkInInput.value));
    let checkInValue = '';
    let checkOutDate = new Date(Date.parse(this.bookingForm.value['checkOut']));
    if(checkInDate.getTime() < this.ciDefaultDate.getTime()){
      checkInValue = this.dateService.dateToString(this.ciDefaultDate);
      checkInInput.value = checkInValue
      this.bookingForm.value['checkIn']  = checkInValue;
    }
    else if(checkInDate.getTime() >= checkOutDate.getTime()){
      checkInDate = checkOutDate;
      checkInDate.setDate(checkInDate.getDate() - 1);
      checkInValue = this.dateService.dateToString((checkInDate));
      checkInInput.value = checkInValue;
      this.bookingForm.value['checkIn']  = checkInValue;
    }
    this.setOccupiedRooms(this.bookingForm.value['checkIn'],this.bookingForm.value['checkOut']);
    this.bookingForm.value['rooms'] = [];
  }

  public onCheckOutChange(event: Event): void{
    let checkOutInput = (event.target as HTMLInputElement);
    let checkOutDate = new Date(Date.parse(checkOutInput.value));
    let checkOutValue = '';
    let checkInDate = new Date(Date.parse(this.bookingForm.value['checkIn']));

    if(checkOutDate.getTime() <= checkInDate.getTime()){
      checkOutDate = checkInDate;
      checkOutDate.setDate(checkOutDate.getDate() + 1 );
      checkOutValue = this.dateService.dateToString(checkOutDate);
      checkOutInput.value = checkOutValue;
      this.bookingForm.value['checkOut']  = checkOutValue;
    }
    this.setOccupiedRooms(this.bookingForm.value['checkIn'],this.bookingForm.value['checkOut']);
    this.bookingForm.value['rooms'] = [];
  }
  
  /**
   * * It calculates the subtotal price of a room based on the number of adults and children in that room
   * * @param {any} room - any - The room object that is being passed in.
   *  */
  public subtotalPricePerRoom(room: any){

    if(!room.bookingRoom.numAdults || room.bookingRoom.numAdults < 0){
      room.bookingRoom.numAdults = 0;
    }

    if(!room.bookingRoom.numChildren || room.bookingRoom.numChildren < 0){
      room.bookingRoom.numChildren = 0;
    }
    
    const spaceForAdults = room.roomInfo.roomType[0].capacity - room.bookingRoom.numChildren;
    const spaceForChildren = room.roomInfo.roomType[0].capacity - room.bookingRoom.numAdults;
    
    if(room.bookingRoom.numAdults > spaceForAdults && spaceForAdults >= 0 ){
      room.bookingRoom.numAdults = spaceForAdults;
    }

    if(room.bookingRoom.numChildren > spaceForChildren && spaceForChildren >= 0){
      room.bookingRoom.numChildren = spaceForChildren;
    }

    let adultsQuantity = room.bookingRoom.numAdults;
    let childrenQuantity = room.bookingRoom.numChildren;
    let price = room.roomInfo.roomType[0].price;
    let adultSubtotal = price * adultsQuantity;
    let childrenSubtotal = (price/2) * childrenQuantity;
    room.subtotal = adultSubtotal + childrenSubtotal;
    this.totalBookingPrice();
    return room.subtotal;
  }

  public onOptionClick(completeRoomInfo: any){
    completeRoomInfo.bookingRoom.numAdults = 0;
    completeRoomInfo.bookingRoom.numChildren = 0;
    completeRoomInfo.subtotal = 0;
    this.totalBookingPrice();
  }
  
  /**
  * It takes the total price of the booking, subtracts the discount percentage, and then updates the
  * total price input field
  */
  public totalBookingPrice(){
    const totalPriceInput = document.getElementById('totalPrice') as HTMLInputElement | null;
    let totalPrice = 0;
    if(!totalPriceInput){ return;}
    totalPriceInput.value = totalPrice.toString();
    this.bookingForm.value['totalPrice'] = 0;
    if(this.bookingForm.value['rooms'].length == 0 ) {return;}
    this.bookingForm.value['rooms'].forEach((rooms: any) => totalPrice += rooms.subtotal)
    totalPrice = totalPrice*(1-(this.bookingForm.value['discountPercentage']/100));
    totalPriceInput.value = totalPrice.toFixed(2);
    this.bookingForm.patchValue({totalPrice: Number(totalPrice)});
  }

  private async setBookingForUpdate(): Promise<void>{
    const booking: Booking = await lastValueFrom(this.swDataService.getBooking(this.bookingId));
    this.customer = booking.customer;
    this.availableUpdateRooms = booking.rooms.map(rooms => rooms.room);
    const selectedRooms: any[] = this.completeRoomInfo.filter(rm => this.availableUpdateRooms.includes(rm.roomInfo.roomNumber));
    selectedRooms.forEach(sRm => {
      let bookingRoom = booking.rooms.find(rm => {return rm.room == sRm.roomInfo.roomNumber});
      sRm.bookingRoom.numAdults = bookingRoom?.numAdults;
      sRm.bookingRoom.numChildren = bookingRoom?.numChildren;
      sRm.subtotal = this.subtotalPricePerRoom(sRm);
    });
    this.completeRoomInfo;
    this.bookingForm.setValue({
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      customer: this.customer,
      state: booking.state,
      type: booking.type,
      rooms: selectedRooms,
      paymentMethod: booking.paymentMethod,
      discountPercentage: booking.discountPercentage*100,
      totalPrice: booking.totalPrice
    });
    console.log(this.bookingForm.value['customer'])
  }


  public async handleBooking(){
    this.customer = get_customer();
    this.bookingForm.patchValue({customer: Number(this.customer)});

    if(!this.bookingForm.valid) {
      this.bookingForm.markAllAsTouched();
      return;
      }

    try {
      let booking = {... this.bookingForm.value};
      booking.discountPercentage = booking.discountPercentage/100;
      booking.rooms = booking.rooms.map((room:any) => room.bookingRoom);
      const result: Booking = this.isUpdate?
        await lastValueFrom<Booking>(this.swDataService.updateBooking(booking,this.bookingId)):
        await lastValueFrom<Booking>(this.swDataService.createBooking(booking));
      if(result){
        this.notificationService
        .successfulOperation(this.actions[0],this.actions[1],'la reserva',String(result._id))
        .then(()=>{
          this.router.navigateByUrl('/Dashboard/Resumen');
        });
      }
    } catch (error) {
      console.log(error)
      this.notificationService
        .unsuccessfulOperation(this.actions[0],this.actions[1],'la reserva')
        .then(()=>{
          this.router.navigateByUrl('/Dashboard/Resumen');
        });
    }
  }

  
  constructor(
    private notificationService: NotificationService,
    private swDataService: SWDataService,
    public dateService: DateService,
    private router: Router) {
      customer_select();
    }


  ngOnInit(): void {
    this.ciDefaultDate.setDate(this.ciDefaultDate.getDate()+1);
    this.coDefaultDate.setDate(this.coDefaultDate.getDate()+8);
    this.ciValue = this.dateService.dateToString(this.ciDefaultDate);
    this.coValue = this.dateService.dateToString(this.coDefaultDate);
    this.setCustomers();
    this.setOccupiedRooms(this.ciValue,this.coValue);
    this.setRooms();
    this.bookingForm = new FormGroup({
      checkIn: new FormControl(this.ciValue,[Validators.required]),
      checkOut: new FormControl(this.coValue, Validators.required),
      customer: new FormControl('', Validators.required),
      state: new FormControl('',[Validators.required]),
      type: new FormControl('', [Validators.required]),
      rooms: new FormControl([], [Validators.required]),
      paymentMethod: new FormControl('', Validators.required),
      discountPercentage: new FormControl(0,[Validators.required, Validators.max(100), Validators.min(0)]),
      totalPrice: new FormControl(0,[Validators.required]),      
    });
    if(this.isUpdate){
      this.setBookingForUpdate();
    }
  }
}
