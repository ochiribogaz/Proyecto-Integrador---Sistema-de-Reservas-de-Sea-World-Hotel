import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';


declare function format_date(strDate: string | undefined,withHour:boolean):string;

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {

  public currentUser: User | null = this.authenticationService.getCurrentUser();
  public lastAccess: string | undefined = format_date(this.currentUser?.lastAccess,true);
  private dashboardRoutes : { [id: string] : [string]; } = {}
  public availableRoutes: string[] = [];
  
  /**
  * It calls the logout() function of the AuthenticationService, and then navigates to the root URL
  */
  public doLogout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/');
  }

  /**
  * If the route is in the availableRoutes array, return true, otherwise return false.
  * @param {string} route - The route you want to check if it's available.
  * @returns A boolean value.
  */
  public isRouteAvailable(route: string): boolean{
    return this.availableRoutes.includes(route);
  }

  public formatRoute(route:string): string{
    return route.replace(/([A-Z])/g, ' $1').trim();
  }

  /**
  It filters out the routes that are not meant to be displayed in the dashboard and then adds the
  * remaining routes to the `dashboardRoutes` object
  */
  private setRoutes(): void{
    this.router.config[0].children?.filter(
      route => !String(route.path).includes('Actualizar') && (!route?.data?.['roles'] || route?.data?.['roles'].includes(this.currentUser?.role)))
      .forEach(route => {
        this.dashboardRoutes[String(route.path)] = route?.data?.['roles']
      });
      this.availableRoutes = Object.keys(this.dashboardRoutes);
  }

  constructor(private router: Router,private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    if(!this.authenticationService.isLoggedIn()){
      this.router.navigateByUrl('/');
    }
    this.setRoutes();
  }

}
