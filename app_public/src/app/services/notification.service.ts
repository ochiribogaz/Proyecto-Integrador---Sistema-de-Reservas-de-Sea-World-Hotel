import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import Swal, {SweetAlertIcon, SweetAlertResult} from 'sweetalert2';
import { PayphoneResponse, Transaction, User } from '../interfaces/interfaces';
import { UserManagerComponent } from '../pages/user-manager/user-manager.component';
import { PaymentService } from './payment.service';
import { SWDataService } from './swdata.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  swalAlert = Swal.mixin({
    heightAuto: false,
    customClass: {
      confirmButton: 'button m-1',
      cancelButton: 'button-invert m-1'
    },
    buttonsStyling: false
  })
  

  constructor(
    private swDataService: SWDataService,
    private paymentService: PaymentService
    ) { }

  public deleteDocument(documentType:string,documentId:string): Promise<SweetAlertResult<any>>{
    return this.swalAlert.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará ${documentType} con id: ${documentId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
  };

  public successfulOperation(operation:string,overb: string,documentType:string,documentId:string): Promise<SweetAlertResult<any>>{
    return this.swalAlert.fire({
      icon: 'success',
      title: `${operation} exitosa`,
      text: `Se ha ${overb} ${documentType} con id: ${documentId}`,
    });
  }

  public resetPassword(success:boolean,email:string = ''): Promise<SweetAlertResult<any>>{
    return this.swalAlert.fire({
      icon: `${success?'success':'error'}`,
      title: `Restablecimiento de contraseña ${success?'exitoso':'fallido'}`,
      text: `${success?'Se':'No se'} ha cambiado la contraseña de tu cuenta ${email} ${success?'con éxito':'. Por favor genera otra link para restablecer la contraseña'}`
    });
  }

  public logOut(): Promise<SweetAlertResult<any>>{
    return this.swalAlert.fire({
      icon: 'info',
      text: 'Por tu seguridad se ha cerrado la sesión'
    });
  }

  public defaultNotification(icon: SweetAlertIcon, text: string){
    return this.swalAlert.fire({
      icon: icon,
      text: text
    });
  }

  public unsuccessfulOperation(operation:string,overb: string,documentType:string): Promise<SweetAlertResult<any>>{
    return this.swalAlert.fire({
      icon: 'error',
      title: `${operation} fallida`,
      text: `No se ha ${overb} ${documentType}`,
    });
  }

  public async paymentStatus(transaction: Transaction): Promise<number>{
    let statusCode: number = 1;
    await this.swalAlert.fire({
      icon: 'info',
      text: 'Por favor, revisa tu celular y realiza el pago',
      confirmButtonText: 'Pagar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: async() => {
        const payphoneResponse: PayphoneResponse = await lastValueFrom(this.paymentService.getTransactionState(transaction));
        statusCode = payphoneResponse.statusCode;
        if(statusCode == 1){
          this.swalAlert.showValidationMessage('<i class="bi bi-exclamation-circle-fill error-icon"></i><span class="mx-3">Todavía no se ha confirmado el pago. Intenta de nuevo.</span>');
        }
      }
    })
    .then(() => {
      console.log('El status es', statusCode);
    })
    return statusCode;
  }

  
  public async handleUser(isUpdate:boolean=false,userId:string=''){
    const actions: string[] = isUpdate?
    ['Actualizar','Actualización','actualizado']:
    ['Crear','Creación','creado'];

    let user: User | null = isUpdate?
    await lastValueFrom(this.swDataService.getUser(userId)):null;
    console.log(user);
    await this.swalAlert.fire({
      title: `<h2 >${actions[0]} Usuarios</h2>`,
      html: '<div id="userOperation"><label for="name" class="not-label">Nombre</label>'
      +`<input id="name" value="${isUpdate?user?.name:''}" type="text" placeholder="Nombre del usuario" name="name" class="not-input">`
      +'<label for="lastname" class="not-label">Apellido</label>'
      +`<input id="lastname" value="${isUpdate?user?.lastname:''}" type="text" placeholder="Apellido del usuario" name="lastname" class="not-input">`
      +'<label for="role" class="not-label"">Rol</label>'
      +'<select id="role" name="role" class="not-select">'
      +'<option value="" disabled>Seleccione el rol del usuario</option>'
      +`<option ${isUpdate&&user?.role=='editor'?'selected':''} value="editor">Editor</option>`
      +`<option ${isUpdate&&user?.role=='admin'?'selected':''} value="admin">Administrador</option>`
      +'</select>'
      +'<label for="email" class="not-label">Email</label>'
      +`<input id="email" value="${isUpdate?user?.email:''}" type="email" placeholder="Correo del usuario" name="email" class="not-input"></div>`,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        user = {
          name: (<HTMLInputElement>document.getElementById('name'))?.value,
          lastname:(<HTMLInputElement>document.getElementById('lastname'))?.value,
          role: (<HTMLInputElement>document.getElementById('role'))?.value,
          email: (<HTMLInputElement>document.getElementById('email'))?.value
        }

        if(!user.name||!user.lastname||!user.role||!user.email){
          this.swalAlert.showValidationMessage('<i class="bi bi-exclamation-circle-fill error-icon"></i><span class="mx-3">Todos los campos son requeridos</span>');
        }
        else if(!user.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        {
          this.swalAlert.showValidationMessage('<i class="bi bi-exclamation-circle-fill error-icon"></i><span class="mx-3">Correo ingresado no valido</span>');
        }
      }
    }).then(async(result) => {
      if(!result.isConfirmed){return;}
      if(!user){return;}

      try {
        const result: User = isUpdate?
        await lastValueFrom<User>(this.swDataService.updateUser(user,userId)):
        await lastValueFrom<User>(this.swDataService.createUser(user));
        this.successfulOperation(actions[1],actions[2],'el usuario',user.email);
      } 
      catch (error) {
        this.unsuccessfulOperation(actions[1],actions[2],'el usuario');
      }
    });
  };




}
