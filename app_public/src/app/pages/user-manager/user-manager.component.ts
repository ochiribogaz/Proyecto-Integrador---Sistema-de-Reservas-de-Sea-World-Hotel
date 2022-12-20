import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';
import { DataTableDirective } from 'angular-datatables';
import { DataTableService } from 'src/app/services/data-table.service';
import { lastValueFrom, Subject } from 'rxjs';



declare function format_date(strDate: string | undefined,withHour:boolean):string;

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;

  public currentUser: User | null = this.authenticationService.getCurrentUser();
  public users: User[] = [];
  public dtTrigger: Subject<any> = new Subject<void>();
  public dtOptions: any = {};
  private initializeTable: boolean = true;


  
/**
 * It gets the users from the database, filters out the current user, formats the lastAccess date, and
 * then converts the table to a DataTable
 */
  public async setUsers(): Promise<void> {
    this.users = await lastValueFrom(this.swDataService.getUsers());
    if(this.initializeTable){
      this.initializeTable = false;
      this.dtTrigger.next(this.dtOptions);
    }
    else{
      console.log('Rerender')
      this.dtService.rerender(this.dtElement,this.dtTrigger,this.dtOptions);
    }
  }


  public deleteUser(userId: string){
    this.notificationService.deleteDocument('el usuario',userId)
    .then(async(result) => {
      if(!result.isConfirmed){return}
      try {
        await lastValueFrom(this.swDataService.deleteDocument('users', userId));
      } catch (error) {
        this.notificationService.unsuccessfulOperation('Eliminación','eliminado','el usuario');
        return;
      }
      this.setUsers();
      this.notificationService.successfulOperation('Eliminación','eliminado','el usuario',userId);
    });
  }

  public async handleUser(isUpdate:boolean=false,userId:string=''){
    await this.notificationService.handleUser(isUpdate,userId);
    this.setUsers();
  }

  constructor(public dtService: DataTableService,
    private swDataService: SWDataService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) {
    }

   ngOnInit(): void {
    this.dtOptions = this.dtService.createDtOptions('usuarios','usuario');
    this.setUsers();
  }

  ngOnDestroy(): void {
    console.log('Unsubscribing from dtService')
    this.dtTrigger.unsubscribe();
  }



}
