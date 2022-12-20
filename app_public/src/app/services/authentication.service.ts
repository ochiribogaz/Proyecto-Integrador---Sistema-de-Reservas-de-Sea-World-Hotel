import { Inject, Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/authresponse';
import { AuthUser } from '../interfaces/authuser';
import { SWDataService } from './swdata.service';
import { BROWSER_LOCAL_STORAGE } from './storage';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(@Inject(BROWSER_LOCAL_STORAGE) private storage: Storage, private SWDataService: SWDataService) { }

  public login(user: AuthUser): Promise<any> {
    return this.SWDataService.login(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }
  
  public logout(): void {
    this.storage.removeItem('sw-token');
  }

  public saveToken(token: string): void {
    this.storage.setItem('sw-token', token);
  }

  public getToken(): string | null {
    return this.storage.getItem('sw-token');
  }

  public isLoggedIn(): boolean {
    const token: string | null = this.getToken(); // get JWT from localStorage
    if (!token) { return false; }
    const payload = JSON.parse(atob(token.split('.')[1])); // decode the JWT, and retrieve the payload
    return payload.exp > (Date.now() / 1000); // determine if JWT has expired yet.
  }

  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) { return null; }
    const token: string | null = this.getToken();
    if(token == null){ return null; }
    const { _id, name, lastname, email, role, lastAccess } = JSON.parse(atob(token.split('.')[1])); // get email and name fields from payload of JWT
    return { _id, name, lastname, email, role, lastAccess } as User; // cast types for typescript
  }

}

