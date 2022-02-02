import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Line } from '../models/line';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private apiUrl = environment.apiUrl+'/covid'

  constructor(private http:HttpClient) { }

  public getCovidData(dateFrom:String, dateTo:String, region:String) {
    const url: string = this.apiUrl+'/base?dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&region=' + region;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line[])
  }

  public getCovidToDateData(dateFrom:String, dateTo:String, region:String) {
    const url: string = this.apiUrl+'/baseToDate?dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&region=' + region;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line[])
  }

  public getGovRes(dateFrom:String, dateTo:String) {
    const url: string = this.apiUrl+'/govRes?dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line[])
  }

  public getSummary() {
    const url: string = 'https://api.sledilnik.org/api/summary';
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor);
  }
}