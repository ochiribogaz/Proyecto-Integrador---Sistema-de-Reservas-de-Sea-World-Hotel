import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { NotificationService } from 'src/app/services/notification.service';
import { SWDataService } from 'src/app/services/swdata.service';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css']
})
export class ResetPasswordFormComponent implements OnInit {

  private token: string = this.router.url.slice(this.router.url.lastIndexOf('/')+1);
  public resetForm!: FormGroup;

  private matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
      !!control.parent.value &&
      control.value === 
      (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
    };
  }
  

  public async handleReset(){
    if(!this.resetForm.valid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    try {
      const result: User = await lastValueFrom(this.swDataService.resetPassword(this.resetForm.value,this.token));
      if(result){
        this.notificationService.resetPassword(true,result.email)
        .then(() => {
          this.router.navigateByUrl('/');
        });
      }
    } catch (error) {
      console.log(error);
      this.notificationService.resetPassword(false).then(() => {
        this.router.navigateByUrl('/Olvidar');
      });
    }
  }
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private swDataService: SWDataService
    ) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      password: new FormControl('',[Validators.required,this.matchValidator('repeatedPassword',true)]),
      repeatedPassword: new FormControl('',[Validators.required,this.matchValidator('password')])
    })
  }

}
