import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Line } from '../models/line';

@Injectable({
  providedIn: 'root'
})
export class TrafficService {

  private apiUrl = environment.apiUrl+'/traffic'

  constructor(private http:HttpClient) { }

  public getAirData(dateFrom:String, dateTo:String) {
    const url: string = this.apiUrl+'/air?dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line)
  }

  public getAirData2(dateFrom:String, dateTo:String) {
    const url: string = this.apiUrl+'/air2?dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line)
  }

  public getSeaData(dateFrom:String, dateTo:String) {
    const url: string = this.apiUrl+'/sea?dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line)
  }

  public getSeaData2(dateFrom:String, dateTo:String) {
    const url: string = this.apiUrl+'/sea2?dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line)
  }

  public getRoadData(dateFrom:String, dateTo:String, stm:any[], vehicleType:string, page:String) {
    const url: string = this.apiUrl+'/road?dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&stm=' + stm + '&vehicleType=' + vehicleType + '&page=' + page;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line[])
  }

  public getStmData() {
    const url: string = this.apiUrl+'/stm';
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor)
  }
}
