import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';



@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.css']
})
export class ProfileManagerComponent implements OnInit {
  public currentUser: User | null = this.authenticationService.getCurrentUser();
  public userForm!: FormGroup;
  public actions: string[] = ['Actualización','actualizado'];
  public allowEdit: boolean =  false;


  public async handleUser(){
    console.log('Calling handle user')
    if(!this.userForm.valid) {
      console.log(this.userForm.value)
      this.userForm.markAllAsTouched();
      return;
    }

    console.log('Going through this')
    
    if(this.currentUser?.role != 'admin'){
      this.userForm.value['role'] = this.currentUser?.role;
    }

    try {
      console.log('Inside try')
      console.log(this.currentUser);
      const result: User = await lastValueFrom<User>(this.swDataService.updateUser(this.userForm.value,this.currentUser?._id?this.currentUser._id:''));
      console.log(result);
      if(result){
        this.notificationService
        .successfulOperation(this.actions[0],this.actions[1],'tu usuario',this.currentUser?this.currentUser.email:'')
        .then(()=>{
          this.notificationService.logOut().then(() => {
            this.authenticationService.logout();
            this.router.navigateByUrl('/');
          });
        });
      }
    } catch (error) {
      console.log('catch')
      this.notificationService
      .unsuccessfulOperation(this.actions[0],this.actions[1],'tu usuario')
      .then(()=>{
        this.setAllowEdit();
      });
    }
  }

  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private swDataService: SWDataService) { }

  
  private setUserForm(){
    this.userForm = new FormGroup({
      email: new FormControl(this.currentUser?.email,[Validators.required,Validators.email]),
      name: new FormControl(this.currentUser?.name, Validators.required),
      lastname: new FormControl(this.currentUser?.lastname, Validators.required),
      role: new FormControl(this.currentUser?.role,Validators.required),
    });
  }
  ngOnInit(): void {
    this.setUserForm();
    this.userForm.disable();
  }

  public setAllowEdit(): void{
    console.log('Allow Edit')
    if(!this.allowEdit){
      this.allowEdit = true;
      this.userForm.enable();
      if(this.currentUser?.role!='admin'){
        this.userForm.controls['role'].disable();
      }
      return;
    }
    this.setUserForm();
    this.userForm.disable();
    this.allowEdit = false;
  }

}
