import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, lastValueFrom } from 'rxjs';
import { RoomType } from 'src/app/interfaces/interfaces';
import { DataTableService } from 'src/app/services/data-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';

@Component({
  selector: 'app-room-type-reader',
  templateUrl: './room-type-reader.component.html',
  styleUrls: ['./room-type-reader.component.css']
})
export class RoomTypeReaderComponent implements OnInit {
  
  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;

  public roomTypes: RoomType[] = [];
  private initializeTable: boolean = true;
  public dtTrigger: Subject<any> = new Subject<void>();
  public dtOptions: any = {};

  private async setRoomTypes(): Promise<void> {
    try {
      this.roomTypes = await lastValueFrom(this.swDataService.getRoomTypes());
    } catch (error) {
      this.roomTypes = [];
    }
    console.log(this.roomTypes)
    if(this.initializeTable){
      this.initializeTable = false;
      this.dtTrigger.next(this.dtOptions);
    }
    else{
      this.dtService.rerender(this.dtElement,this.dtTrigger,this.dtOptions)
    }
  }

  constructor(
    private notificationService: NotificationService,
    public dtService: DataTableService,
    private swDataService: SWDataService) { }

  ngOnInit(): void {
    this.dtOptions = this.dtService.createDtOptions('tipos de habitación','tipo de habitación');
    this.setRoomTypes();
  }

  public deleteRType(rTypeId: string){
    this.notificationService.deleteDocument('el tipo de habitación',rTypeId)
    .then(async(result) => {
      if(!result.isConfirmed){return}
      try {
        await lastValueFrom(this.swDataService.deleteDocument('roomTypes', rTypeId));
      } catch (error) {
        this.notificationService.unsuccessfulOperation('Eliminación','eliminado','el tipo de habitación');
        return;
      }
      this.setRoomTypes();
      this.notificationService.successfulOperation('Eliminación','eliminado','el tipo de habitación',rTypeId);
    });
  }

  ngOnDestroy(): void {
    console.log('Unsubscribing from dtService')
    this.dtTrigger.unsubscribe();
  }

}
