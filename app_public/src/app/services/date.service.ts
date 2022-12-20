import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public dateToString(date: Date){
    const strDate: string = date.toLocaleDateString('en-US',{timeZone: 'America/Guayaquil'});
    const arrDate: string[] = strDate.split('/');
    arrDate[0] = arrDate[0].length == 1? `0${arrDate[0]}`: arrDate[0];
    arrDate[1] = arrDate[1].length == 1? `0${arrDate[1]}`: arrDate[1];
    return `${arrDate[2]}-${arrDate[0]}-${arrDate[1]}`;
  }

  

}
