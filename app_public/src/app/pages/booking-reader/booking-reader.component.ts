import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { lastValueFrom, Subject } from 'rxjs';
import { Booking } from 'src/app/interfaces/interfaces';
import { DataTableService } from 'src/app/services/data-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';

declare function format_date(strDate: string | undefined,withHour:boolean):string;

@Component({
  selector: 'app-booking-reader',
  templateUrl: './booking-reader.component.html',
  styleUrls: ['./booking-reader.component.css']
})
export class BookingReaderComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;

  public bookings: Booking[] = [];
  private initializeTable: boolean = true;
  public dtTrigger: Subject<any> = new Subject<void>();
  public dtOptions: any = {};

  private async setBookings(): Promise<void> {
    try {
      this.bookings = await lastValueFrom(this.swDataService.getBookings());
      if(this.bookings.length > 0){
        this.bookings.forEach(booking => {
          booking.checkIn = format_date(booking.checkIn,false);
          booking.checkOut = format_date(booking.checkOut,false);
          booking.roomList = booking.rooms.map(rm => rm.room);
          booking.totalAdults = 0;
          booking.totalChildren = 0;
        });
      }
    } catch (error) {
      this.bookings = [];
    }
    if(this.initializeTable){
      this.initializeTable = false;
      this.dtTrigger.next(this.dtOptions);
    }
    else{
      this.dtService.rerender(this.dtElement,this.dtTrigger,this.dtOptions)
    }
  }

  public deleteBooking(bookingId: string){
    this.notificationService.deleteDocument('la reserva',bookingId)
    .then(async(result) => {
      if(!result.isConfirmed){return}
      try {
        await lastValueFrom(this.swDataService.deleteDocument('bookings', bookingId));
      } catch (error) {
        this.notificationService.unsuccessfulOperation('Eliminación','eliminado','la reserva');
        return;
      }
      this.setBookings();
      this.notificationService.successfulOperation('Eliminación','eliminado','la reserva',bookingId);
    });
  }

  constructor(
    private notificationService: NotificationService,
    public dtService: DataTableService,
    private swDataService: SWDataService) { }

  ngOnInit(): void {
    this.dtOptions = this.dtService.createDtOptions('reservas','reserva');
    this.setBookings();
  }

  ngOnDestroy(): void {
    console.log('Unsubscribing from dtService')
    this.dtTrigger.unsubscribe();
  }

}
