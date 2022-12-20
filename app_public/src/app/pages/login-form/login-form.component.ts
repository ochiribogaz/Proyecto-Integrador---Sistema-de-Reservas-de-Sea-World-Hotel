import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthUser } from 'src/app/interfaces/authuser';
import { SWDataService } from 'src/app/services/swdata.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  public credentials: AuthUser = {
    email: '',
    password: ''
  };

  public formError: string = '<br>';

  public onLoginSubmit(): void {
    this.formError = '<br>';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Todos los campos son requeridos';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    this.authenticationService.login(this.credentials)
      .then(() => this.router.navigateByUrl('/Dashboard/Resumen'))
      .catch((e) => {
        this.formError = 'Usuario o contraseña incorrectos';
      });
  }


  constructor(private router: Router,private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
