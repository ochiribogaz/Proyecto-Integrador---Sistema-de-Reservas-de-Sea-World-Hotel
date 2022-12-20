import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/authresponse';
import { AuthUser, ResetEmail, ResetPassword } from '../interfaces/authuser';
import { Booking, CompleteRoom, Customer, CustomerAndBooking, OccupiedRoom, Room, RoomType, User } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { BROWSER_LOCAL_STORAGE } from './storage';

@Injectable({
  providedIn: 'root'
})
export class SWDataService {

  private apiBaseUrl = environment.apiBaseUrl;

  private httpOptions = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${this.storage.getItem('sw-token')}` }) // add jwt to header
  }

  constructor(private http: HttpClient, @Inject(BROWSER_LOCAL_STORAGE) private storage: Storage) { }

  public login(user: AuthUser): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }
  
  private makeAuthApiCall(urlPath: string, user: AuthUser): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/api/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response as AuthResponse)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<AuthResponse> {
    console.error('Ha ocurrido un error', error);
    return Promise.reject(error.message || error);
  }

  public getCustomers(): Observable<Customer[]> {
    const url: string = `${this.apiBaseUrl}/api/customers/`;
    return this.http.get<Customer[]>(url, this.httpOptions);
  }

  public getCustomer(id:string): Observable<Customer> {
    const url: string = `${this.apiBaseUrl}/api/customers/${id}`;
    return this.http.get<Customer>(url, this.httpOptions);
  }

  public updateCustomer(customer:Customer,id:string): Observable<Customer>{
    const url: string = `${this.apiBaseUrl}/api/customers/${id}`;
    return this.http.put<Customer>(url,customer, this.httpOptions);
  }

  public createCustomer(customer:Customer): Observable<Customer>{
    const url: string = `${this.apiBaseUrl}/api/customers/`;
    return this.http.post<Customer>(url,customer, this.httpOptions);
  }

  public getUsers(): Observable<User[]> {
    const url: string = `${this.apiBaseUrl}/api/users/`;
    return this.http.get<User[]>(url, this.httpOptions);
  }

  public getUser(id:string): Observable<User> {
    const url: string = `${this.apiBaseUrl}/api/users/${id}`;
    return this.http.get<User>(url, this.httpOptions)
  }

  public updateUser(user: User,id:string): Observable<User> {
    const url: string = `${this.apiBaseUrl}/api/users/${id}`;
    return this.http.put<User>(url,user, this.httpOptions);
  }

  public createUser(user:User): Observable<User>{
    const url: string = `${this.apiBaseUrl}/api/users/`;
    return this.http.post<User>(url,user, this.httpOptions);
  }

  public getBookings(): Observable<Booking[]> {
    const url: string = `${this.apiBaseUrl}/api/bookings/`;
    return this.http.get<Booking[]>(url, this.httpOptions);
  }

  public getBooking(id:string): Observable<Booking>  {
    const url: string = `${this.apiBaseUrl}/api/bookings/${id}`;
    return this.http.get<Booking>(url, this.httpOptions);
  }

  public updateBooking(booking: Booking,id:string): Observable<Booking> {
    const url: string = `${this.apiBaseUrl}/api/bookings/${id}`;
    return this.http.put<Booking>(url,booking, this.httpOptions);
  }

  public createBooking(booking: Booking): Observable<Booking> {
    const url: string = `${this.apiBaseUrl}/api/bookings/`;
    return this.http.post<Booking>(url,booking, this.httpOptions);
  }

  public getRooms(): Observable<CompleteRoom[]> {
    const url: string = `${this.apiBaseUrl}/api/rooms/`;
    return this.http.get<CompleteRoom[]>(url, this.httpOptions);
  }

  public getRoom(id:string): Observable<Room> {
    const url: string = `${this.apiBaseUrl}/api/rooms/${id}`;
    return this.http.get<Room>(url, this.httpOptions);
  }

  public getCompleteRoom(id:string): Observable<CompleteRoom> {
    const url: string = `${this.apiBaseUrl}/api/completeRoom/${id}`;
    return this.http.get<CompleteRoom>(url, this.httpOptions);
  }

  public updateRoom(room: Room,id:string): Observable<Room> {
    const url: string = `${this.apiBaseUrl}/api/rooms/${id}`;
    return this.http.put<Room>(url,room, this.httpOptions);
  }

  public createRoom(room: Room): Observable<Room> {
    const url: string = `${this.apiBaseUrl}/api/rooms/`;
    return this.http.post<Room>(url,room, this.httpOptions);
  }

  public getRoomTypes(): Observable<RoomType[]> {
    const url: string = `${this.apiBaseUrl}/api/roomTypes/`;
    return this.http.get<RoomType[]>(url, this.httpOptions);
  }

  public getRoomType(id:string): Observable<RoomType> {
    const url: string = `${this.apiBaseUrl}/api/roomTypes/${id}`;
    return this.http.get<RoomType>(url, this.httpOptions);
  }

  public getOccupiedRooms(checkIn:string, checkOut:string): Observable<OccupiedRoom[]> {
    const url: string = `${this.apiBaseUrl}/api/occupiedRooms/${checkIn}/${checkOut}`;
    return this.http.get<OccupiedRoom[]>(url, this.httpOptions);
  }

  public updateRoomType(roomType: RoomType,id:string): Observable<RoomType> {
    const url: string = `${this.apiBaseUrl}/api/roomTypes/${id}`;
    return this.http.put<RoomType>(url,roomType, this.httpOptions);
  }

  public createRoomType(roomType: RoomType): Observable<RoomType> {
    const url: string = `${this.apiBaseUrl}/api/roomTypes/`;
    return this.http.post<RoomType>(url,roomType, this.httpOptions);
  }

  public addCustomerAndBooking(customerAndBooking: CustomerAndBooking): Observable<CustomerAndBooking>{
    const url: string = `${this.apiBaseUrl}/api/customerBooking/`; 
    return this.http.post<CustomerAndBooking>(url,customerAndBooking);
  }

  public deleteDocument(collection:string,documentId:string){
    const url: string = `${this.apiBaseUrl}/api/${collection}/${documentId}`;
    console.log(url);
    return this.http.delete(url, this.httpOptions);
  }

  public forgotPassword(rEmail: ResetEmail){
    const url: string = `${this.apiBaseUrl}/api/forgotPassword/`;
    return this.http.put(url,rEmail); 
  }

  public resetPassword(rPassword: ResetPassword,token:string): Observable<User>{
    const url: string = `${this.apiBaseUrl}/api/resetPassword/${token}`;
    return this.http.put<User>(url,rPassword); 
  }
}
