import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CompleteRoom, OccupiedRoom, RoomType } from 'src/app/interfaces/interfaces';
import { DateService } from 'src/app/services/date.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BROWSER_LOCAL_STORAGE, BROWSER_SESSION_STORAGE } from 'src/app/services/storage';
import { SWDataService } from 'src/app/services/swdata.service';

@Component({
  selector: 'app-available-rooms',
  templateUrl: './available-rooms.component.html',
  styleUrls: ['./available-rooms.component.css']
})
export class AvailableRoomsComponent implements OnInit {

  public datesForm!: FormGroup;

  public ciDefaultDate: Date = new Date();
  public coDefaultDate: Date = new Date();
  public ciValue!: string;
  public coValue!: string;

  public rooms: CompleteRoom[] = [];
  private ocuppiedRooms!: OccupiedRoom[];
  public oRoomsNumbers: Set<number> = new Set();
  public roomTypes: RoomType[] = [];

  private storageDates: string | null = this.storage.getItem('dates');


  public onCheckInChange(event: Event): void{
    let checkInInput = (event.target as HTMLInputElement);
    let checkInDate = new Date(Date.parse(checkInInput.value));
    let checkInValue = '';
    let checkOutDate = new Date(Date.parse(this.datesForm.value['checkOut']));
    if(checkInDate.getTime() < this.ciDefaultDate.getTime()){
      checkInValue = this.dateService.dateToString(this.ciDefaultDate);
      checkInInput.value = checkInValue;
      this.datesForm.value['checkIn']  = checkInValue;
    }
    else if(checkInDate.getTime() >= checkOutDate.getTime()){
      checkInDate = checkOutDate;
      checkInDate.setDate(checkInDate.getDate() - 1);
      checkInValue = this.dateService.dateToString((checkInDate));
      checkInInput.value = checkInValue;
      this.datesForm.value['checkIn']  = checkInValue;
    }
  }

  public onCheckOutChange(event: Event): void{
    let checkOutInput = (event.target as HTMLInputElement);
    let checkOutDate = new Date(Date.parse(checkOutInput.value));
    let checkOutValue = '';
    let checkInDate = new Date(Date.parse(this.datesForm.value['checkIn']));

    if(checkOutDate.getTime() <= checkInDate.getTime()){
      checkOutDate = checkInDate;
      checkOutDate.setDate(checkOutDate.getDate() + 1 );
      checkOutValue = this.dateService.dateToString(checkOutDate);
      checkOutInput.value = checkOutValue;
      this.datesForm.value['checkOut']  = checkOutValue;
    }
  }

  private async setRooms(): Promise<void> {
    try {
      this.rooms = await lastValueFrom(this.swDataService.getRooms());
    } catch (error) {
      this.rooms = [];
    }
  }

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
      this.rooms = this.rooms.filter(room => !this.oRoomsNumbers.has(room.roomNumber));
    }
  }

  private setRoomTypes(){
    this.rooms.forEach(room => {
      if(this.roomTypes.find(rt => {return rt._id == room.roomType[0]._id})){
        return;
      }
      if(!room.roomType[0].rooms){
        room.roomType[0].rooms = [];
        }
        room.roomType[0].rooms.push(room._id);
        this.roomTypes.push(room.roomType[0]);       
      });
  }

  public handleDates(){
    if(!this.datesForm.valid) {
      this.datesForm.markAllAsTouched();
      return;
    }

    if(this.storage.getItem('rooms')){
      this.storage.removeItem('rooms');
    }

    if(this.storageDates){
      this.storage.removeItem('dates');
      this.storage.setItem('dates',JSON.stringify([this.datesForm.value['checkIn'],this.datesForm.value['checkOut']]));
    }
    this.setOccupiedRooms(this.datesForm.value['checkIn'],this.datesForm.value['checkOut']);
  }

  public goToPayment(){
    if(!this.storage.getItem('dates') || !this.storage.getItem('rooms')){
      this.notificationService
        .defaultNotification('info','Por favor selecciona la fecha de tu estadía y las habitaciones a reservar')
      return;
    }
    this.router.navigateByUrl('/Pagar');
  }

  constructor(
    @Inject(BROWSER_SESSION_STORAGE) private storage: Storage,
    private swDataService: SWDataService,
    private notificationService: NotificationService,
    private router: Router,
    public dateService: DateService) {}

  async ngOnInit(): Promise<void> {
    this.ciDefaultDate.setDate(this.ciDefaultDate.getDate()+1);
    this.coDefaultDate.setDate(this.coDefaultDate.getDate()+8);
    this.ciValue = this.dateService.dateToString(this.ciDefaultDate);
    this.coValue = this.dateService.dateToString(this.coDefaultDate);
    let savedDates = [];
    if(this.storageDates){
      savedDates = JSON.parse(this.storageDates);
    } else{
      this.storage.setItem('dates',JSON.stringify([this.ciValue,this.coValue]));
    }
    this.datesForm = new FormGroup({
      checkIn: new FormControl(this.storageDates?savedDates[0]:this.ciValue, Validators.required),
      checkOut: new FormControl(this.storageDates?savedDates[1]:this.coValue, Validators.required)
    });
    await this.setRooms();
    await this.setOccupiedRooms(this.ciValue,this.coValue);
    this.setRoomTypes();
  }

}
