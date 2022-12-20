import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/interfaces';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

  constructor(private router: Router,private authenticationService: AuthenticationService) { }
  
  private currentUser: User | null = this.authenticationService.getCurrentUser();
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthorized = route.data['roles'].includes(this.currentUser?.role);
    if(!isAuthorized){
      this.router.navigateByUrl('/Dashboard/Resumen');
    }
    return isAuthorized;
  }
  
}
