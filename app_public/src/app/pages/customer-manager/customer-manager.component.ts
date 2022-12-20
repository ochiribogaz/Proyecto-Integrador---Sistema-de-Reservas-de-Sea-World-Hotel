import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Customer } from 'src/app/interfaces/interfaces';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';

@Component({
  selector: 'app-customer-manager',
  templateUrl: './customer-manager.component.html',
  styleUrls: ['./customer-manager.component.css']
})
export class CustomerManagerComponent implements OnInit {

  public customerForm!: FormGroup;
  private isUpdate: boolean = this.router.url.includes('Actualizar');
  private customerId: string = this.isUpdate?this.router.url.slice(this.router.url.lastIndexOf('/')+1):'';
  public actionTitle: string = this.isUpdate?'Actualizar':'Registrar';
  public actions: string[] = this.isUpdate? ['Actualización','actualizado']: ['Creación','creado'];


  private async setCustomerForUpdate(){
    const customer: Customer = await lastValueFrom(this.swDataService.getCustomer(this.customerId));
    console.log(customer);
    this.customerForm.setValue({
      customerId: customer.customerId,
      name: customer.name,
      lastname: customer.lastname,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      province: customer.province
    });
  }

  public async handleCustomer(){
    if(!this.customerForm.valid) {
      this.customerForm.markAllAsTouched();
      return;
      }

    try {
      console.log(this.customerId.length)
      const result: Customer = this.isUpdate?
        await lastValueFrom<Customer>(this.swDataService.updateCustomer(this.customerForm.value,this.customerId)):
        await lastValueFrom<Customer>(this.swDataService.createCustomer(this.customerForm.value));
      if(result){
        this.notificationService
        .successfulOperation(this.actions[0],this.actions[1],'el cliente',String(result.customerId))
        .then(()=>{
          if(this.isUpdate){
            this.router.navigateByUrl('/Dashboard/Resumen')
            return;
          }
          this.customerForm.reset();
        });
      }
    } catch (error) {
      this.notificationService
      .unsuccessfulOperation(this.actions[0],this.actions[1],'el cliente')
      .then(()=>{
        this.customerForm.reset();
      });
    }
  }

  
  constructor(
    private notificationService: NotificationService,
    private swDataService: SWDataService,
    private router: Router) { }


  ngOnInit(): void {
    this.customerForm = new FormGroup({
      customerId: new FormControl('',[Validators.required]),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      phone: new FormControl('',[Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email]),
      address: new FormControl('', Validators.required),
      province: new FormControl('', Validators.required)
    });
    if(this.isUpdate){
      this.setCustomerForUpdate();
    }
  }

}
