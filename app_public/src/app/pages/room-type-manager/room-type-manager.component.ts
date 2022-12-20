import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { RoomType } from 'src/app/interfaces/interfaces';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';


declare function amenities_select():void;
declare function get_amenities():string[];
declare function reset_amenities():void;

@Component({
  selector: 'app-room-type-manager',
  templateUrl: './room-type-manager.component.html',
  styleUrls: ['./room-type-manager.component.css']
})
export class RoomTypeManagerComponent implements AfterViewInit,OnInit {
  public roomTypeForm!: FormGroup;
  private isUpdate: boolean = this.router.url.includes('Actualizar');
  private roomTypeId: string = this.isUpdate?this.router.url.slice(this.router.url.lastIndexOf('/')+1):'';
  public actionTitle: string = this.isUpdate?'Actualizar':'Registrar';
  public actions: string[] = this.isUpdate? ['Actualización','actualizado']: ['Creación','creado'];
  public roomAmenities: string [] = [
    'Aire Acondicionado',
    'Balcón',
    'Ducha de agua caliente',
    'TV por cable',
    'Teléfono interno',
    'Cama doble',
    'Cama litera de plaza y media',
    'Cama de plaza y media'
  ];
  public selectedAmenities: string[] = [];

  private async setRoomTypeForUpdate(){
    const roomType: RoomType = await lastValueFrom(this.swDataService.getRoomType(this.roomTypeId));
    console.log(roomType.amenities);
    this.selectedAmenities = roomType.amenities;
    this.roomTypeForm.setValue({
      roomCategory: roomType.roomCategory,
      roomSize: roomType.roomSize,
      amenities: this.selectedAmenities,
      price: roomType.price,
      capacity: roomType.capacity,
      imageUrl: roomType.imageUrl
    });
  }
  

  public async handleRoomType(){
    this.selectedAmenities = get_amenities();
    console.log(this.selectedAmenities);
    this.roomTypeForm.patchValue({amenities: this.selectedAmenities});
    if(!this.roomTypeForm.valid) {      
      this.roomTypeForm.markAllAsTouched();
      return;
      }
    console.log(this.roomTypeForm.value)
    try {
      console.log(this.roomTypeId.length)
      const result: RoomType = this.isUpdate?
        await lastValueFrom<RoomType>(this.swDataService.updateRoomType(this.roomTypeForm.value,this.roomTypeId)):
        await lastValueFrom<RoomType>(this.swDataService.createRoomType(this.roomTypeForm.value));
      if(result){
        this.notificationService
        .successfulOperation(this.actions[0],this.actions[1],'el tipo de habitación',String(result._id))
        .then(()=>{
          if(this.isUpdate){
            this.router.navigateByUrl('/Dashboard/Resumen')
          }
          this.roomTypeForm.reset();
          this.selectedAmenities = [];
          reset_amenities();
        });
      }
    } catch (error) {
      this.notificationService
      .unsuccessfulOperation(this.actions[0],this.actions[1],'el tipo de habitación')
      .then(()=>{
        this.roomTypeForm.markAsUntouched();
      });
    }
  }

  
  constructor(
    private notificationService: NotificationService,
    private swDataService: SWDataService,
    private router: Router) {
    }
  ngAfterViewInit(): void {
    amenities_select();
  }


  ngOnInit(): void {
    this.selectedAmenities = [];
    this.roomTypeForm = new FormGroup({
      roomCategory: new FormControl('',[Validators.required]),
      roomSize: new FormControl('', Validators.required),
      amenities: new FormControl([],Validators.required),
      price: new FormControl('',Validators.required),
      capacity: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required)
    });
    console.log(this.roomTypeForm.value);
    if(this.isUpdate){
      this.setRoomTypeForUpdate();
    }
  }


}
