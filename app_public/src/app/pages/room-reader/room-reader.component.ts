import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { lastValueFrom, Subject } from 'rxjs';
import { CompleteRoom } from 'src/app/interfaces/interfaces';
import { DataTableService } from 'src/app/services/data-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';


@Component({
  selector: 'app-room-reader',
  templateUrl: './room-reader.component.html',
  styleUrls: ['./room-reader.component.css']
})

export class RoomReaderComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;

  public rooms: CompleteRoom[] = [];
  private initializeTable: boolean = true;
  public dtTrigger: Subject<any> = new Subject<void>();
  public dtOptions: any = {};

  private async setRooms(): Promise<void> {
    try {
      this.rooms = await lastValueFrom(this.swDataService.getRooms());
    } catch (error) {
      this.rooms = [];
    }
    console.log(this.rooms)
    if(this.initializeTable){
      this.initializeTable = false;
      this.dtTrigger.next(this.dtOptions);
    }
    else{
      this.dtService.rerender(this.dtElement,this.dtTrigger,this.dtOptions)
    }
  }

  public deleteRoom(roomId: string){
    this.notificationService.deleteDocument('la habitación',roomId)
    .then(async(result) => {
      if(!result.isConfirmed){return}
      try {
        await lastValueFrom(this.swDataService.deleteDocument('rooms', roomId));
      } catch (error) {
        this.notificationService.unsuccessfulOperation('Eliminación','eliminado','la habitación');
        return;
      }
      this.setRooms();
      this.notificationService.successfulOperation('Eliminación','eliminado','la habitación',roomId);
    });
  }

  constructor(
    private notificationService: NotificationService,
    public dtService: DataTableService,
    private swDataService: SWDataService) { }

  ngOnInit(): void {
    this.dtOptions = this.dtService.createDtOptions('habitaciones','habitación');
    this.setRooms();
  }

  ngOnDestroy(): void {
    console.log('Unsubscribing from dtService')
    this.dtTrigger.unsubscribe();
  }
}
