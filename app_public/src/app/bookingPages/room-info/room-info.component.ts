import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { CompleteRoom } from 'src/app/interfaces/interfaces';
import { NotificationService } from 'src/app/services/notification.service';
import { BROWSER_LOCAL_STORAGE, BROWSER_SESSION_STORAGE } from 'src/app/services/storage';
import { SWDataService } from 'src/app/services/swdata.service';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.css']
})
export class RoomInfoComponent implements OnInit {

  private roomId: string = this.router.url.slice(this.router.url.lastIndexOf('/')+1);
  public room!: CompleteRoom;
  public amenities!: string[];

  public numPeopleForm!: FormGroup;
  private storageRooms: string | null = this.storage.getItem('rooms');

  private async setRoom(){
    try {
      this.room = await lastValueFrom(this.swDataService.getCompleteRoom(this.roomId));

    } catch (error) {
      console.log(error);
    }
    this.amenities = this.room?this.room.roomType[0].amenities:[];
  }

  public addRoom(){
    if(!this.numPeopleForm.valid) {
      this.numPeopleForm.markAllAsTouched();
      return;
    }

    let rooms = [];
    let roomIndex = -1;
    let room = {room: this.room.roomNumber,... this.numPeopleForm.value, roomType: this.room.roomType[0]._id}
    if(this.storageRooms){
      this.storage.removeItem('rooms');
      rooms = JSON.parse(this.storageRooms);
      roomIndex = rooms.findIndex((rm: { room: number; }) => {return rm.room == this.room.roomNumber});
    }

    if(roomIndex>-1){rooms[roomIndex] = room}
    else{rooms.push(room)}
    console.log(rooms)
    this.storage.setItem('rooms',JSON.stringify(rooms));
    this.notificationService
      .defaultNotification('success','Se ha agregado la habitación a la reserva')
      .then(()=>{
        this.router.navigateByUrl('/Reservar');
      });
  }

  public onNumPeopleChange(){
    const numAdultsInput = document.getElementById('numAdults') as HTMLInputElement | null;
    const numChildrenInput = document.getElementById('numChildren') as HTMLInputElement | null;
    if(!this.numPeopleForm.value['numAdults'] || this.numPeopleForm.value['numAdults'] < 0){
      this.numPeopleForm.value['numAdults'] = 0;
    }

    if(!this.numPeopleForm.value['numChildren'] || this.numPeopleForm.value['numChildren'] < 0){
      this.numPeopleForm.value['numChildren'] = 0;
    }
    
    const spaceForAdults = this.room.roomType[0].capacity - this.numPeopleForm.value['numChildren'];
    const spaceForChildren = this.room.roomType[0].capacity - this.numPeopleForm.value['numAdults'];
    
    if(this.numPeopleForm.value['numAdults'] > spaceForAdults && spaceForAdults >= 0 ){
      console.log('Adults',spaceForAdults)
      this.numPeopleForm.value['numAdults'] = spaceForAdults;
    }

    if(this.numPeopleForm.value['numChildren'] > spaceForChildren && spaceForChildren >= 0){
      console.log('Children',spaceForChildren)
      this.numPeopleForm.value['numChildren'] = spaceForChildren;
    }

    if(this.numPeopleForm.value['numChildren'] == 0 && this.numPeopleForm.value['numAdults'] == 0){
      this.numPeopleForm.value['numAdults'] = 1;
    }

    if(numAdultsInput && numChildrenInput){
      numAdultsInput.value = this.numPeopleForm.value['numAdults'];
      numChildrenInput.value = this.numPeopleForm.value['numChildren'];
    }
  }
  
  constructor(
    @Inject(BROWSER_SESSION_STORAGE) private storage: Storage,
    private notificationService: NotificationService,
    private swDataService: SWDataService,
    private router: Router) { }

  ngOnInit(): void {
    this.setRoom();
    this.numPeopleForm = new FormGroup({
      numAdults: new FormControl(0,Validators.required),
      numChildren: new FormControl(0,Validators.required)
    })
  }

}
