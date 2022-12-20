import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Room, RoomType } from 'src/app/interfaces/interfaces';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';

declare function amenities_select():void;

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrls: ['./room-manager.component.css']
})
export class RoomManagerComponent implements OnInit {

  public roomForm!: FormGroup;
  private isUpdate: boolean = this.router.url.includes('Actualizar');
  private roomId: string = this.isUpdate?this.router.url.slice(this.router.url.lastIndexOf('/')+1):'';
  public actionTitle: string = this.isUpdate?'Actualizar':'Registrar';
  public actions: string[] = this.isUpdate? ['Actualización','actualizado']: ['Creación','creado'];
  public roomTypes: RoomType[] = [];


  private async setRoomTypes(): Promise<void>{
    this.roomTypes = await lastValueFrom(this.swDataService.getRoomTypes());
  }

  private async setRoomForUpdate():Promise<void>{
    const room: Room = await lastValueFrom(this.swDataService.getRoom(this.roomId));
    console.log(room);
    this.roomForm.setValue({
      roomNumber: room.roomNumber,
      floor: room.floor,
      roomType: room.roomType,
    });
  }

  public async handleRoom():Promise<void>{
    if(!this.roomForm.valid) {
      this.roomForm.markAllAsTouched();
      return;
      }

    try {
      console.log(this.roomId.length)
      const result: Room = this.isUpdate?
        await lastValueFrom<Room>(this.swDataService.updateRoom(this.roomForm.value,this.roomId)):
        await lastValueFrom<Room>(this.swDataService.createRoom(this.roomForm.value));
      if(result){
        this.notificationService
        .successfulOperation(this.actions[0],this.actions[1],'la habitación',String(result.roomNumber))
        .then(()=>{
          if(this.isUpdate){
            this.router.navigateByUrl('/Dashboard/Resumen')
            return;
          }
          this.roomForm.reset();
        });
      }
    } catch (error) {
      this.notificationService
      .unsuccessfulOperation(this.actions[0],this.actions[1],'el cliente')
      .then(()=>{
        this.roomForm.reset();
      });
    }
  }

  
  constructor(
    private notificationService: NotificationService,
    private swDataService: SWDataService,
    private router: Router) { }


  ngOnInit(): void {
    this.setRoomTypes();
    this.roomForm = new FormGroup({
      roomNumber: new FormControl('', Validators.required),
      floor: new FormControl('', Validators.required),
      roomType: new FormControl('',Validators.required),
    });
    if(this.isUpdate){
      this.setRoomForUpdate();
    }
  }


}
