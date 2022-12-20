import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-authenticacion-layout',
  templateUrl: './authenticacion-layout.component.html',
  styleUrls: ['./authenticacion-layout.component.css']
})
export class AuthenticacionLayoutComponent implements OnInit {

  
  constructor(private router: Router,private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    if(this.authenticationService.isLoggedIn()){
      this.router.navigateByUrl('/Dashboard/Resumen');
    }
  }

}
