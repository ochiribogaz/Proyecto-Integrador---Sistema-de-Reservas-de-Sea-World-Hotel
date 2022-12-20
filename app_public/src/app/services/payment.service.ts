import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Payment, PayphoneResponse, Transaction } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private payphoneUrl: string = 'https://pay.payphonetodoesposible.com/api/sale';

  private httpOptions = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${environment.token}` })
  }

  constructor(private http: HttpClient) { }

  public doPayment(payment: Payment): Observable<Transaction>{
    return this.http.post<Transaction>(this.payphoneUrl,payment,this.httpOptions);
  }

  public getTransactionState(transaction: Transaction){
    return this.http.get<PayphoneResponse>(`${this.payphoneUrl}/${transaction.transactionId}`,this.httpOptions);    
  }
}
