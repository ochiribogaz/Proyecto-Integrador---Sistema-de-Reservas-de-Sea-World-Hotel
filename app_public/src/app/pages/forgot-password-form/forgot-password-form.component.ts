import { Component, OnInit } from '@angular/core';
import { ResetEmail } from 'src/app/interfaces/authuser';
import { SWDataService } from 'src/app/services/swdata.service';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.css']
})
export class ForgotPasswordFormComponent implements OnInit {

  public rEmail: ResetEmail = {email: ''};
  public formError: string = '<br>';

  generateLink(email:ResetEmail){
    this.formError = '<br>';
    if(this.rEmail.email == ''){
      this.formError = 'Todos los campos son requeridos';
      return;
    }
    this.swDataService.forgotPassword(this.rEmail).subscribe({
      next: (response) => {
        this.formError = `Revisa tu correo`
      },
      error: (e) => {
        this.formError = e.error.message;
      }
    });
  }
  
  constructor(private swDataService: SWDataService) { }


  ngOnInit(): void {
  }

}
