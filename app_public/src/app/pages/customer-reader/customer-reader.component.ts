import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { lastValueFrom, Subject } from 'rxjs';
import { Customer } from 'src/app/interfaces/interfaces';
import { DataTableService } from 'src/app/services/data-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';


@Component({
  selector: 'app-customer-reader',
  templateUrl: './customer-reader.component.html',
  styleUrls: ['./customer-reader.component.css']
})
export class CustomerReaderComponent implements OnInit,OnDestroy  {

  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;

  public customers: Customer[] = [];
  private initializeTable: boolean = true;
  public dtTrigger: Subject<any> = new Subject<void>();
  public dtOptions: any = {};

  private async setCustomers(): Promise<void> {
    try {
      this.customers = await lastValueFrom(this.swDataService.getCustomers());
    } catch (error) {
      this.customers = [];
    }
    if(this.initializeTable){
      this.initializeTable = false;
      this.dtTrigger.next(this.dtOptions);
    }
    else{
      this.dtService.rerender(this.dtElement,this.dtTrigger,this.dtOptions)
    }
  }

  public deleteCustomer(customerId: string){
    this.notificationService.deleteDocument('el cliente',customerId)
    .then(async(result) => {
      if(!result.isConfirmed){return}
      try {
        await lastValueFrom(this.swDataService.deleteDocument('customers', customerId));
      } catch (error) {
        this.notificationService.unsuccessfulOperation('Eliminación','eliminado','la habitación');
        return;
      }
      this.setCustomers();
      this.notificationService.successfulOperation('Eliminación','eliminado','la habitación',customerId);
    });
  }

  constructor(
    private notificationService: NotificationService,
    public dtService: DataTableService,
    private swDataService: SWDataService) { }

  ngOnInit(): void {
    this.dtOptions = this.dtService.createDtOptions('clientes','cliente');
    this.setCustomers();
  }

  ngOnDestroy(): void {
    console.log('Unsubscribing from dtService')
    this.dtTrigger.unsubscribe();
  }


}
