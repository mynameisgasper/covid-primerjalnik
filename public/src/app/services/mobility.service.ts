import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Line } from '../models/line';

@Injectable({
  providedIn: 'root'
})
export class MobilityService {

  private apiUrl = environment.apiUrl+'/mobility'

  constructor(private http:HttpClient) { }

  public getAppleData(dateFrom:String, dateTo:String) {
    const url: string = this.apiUrl+'/apple?dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line[])
  }

  public getGoogleData(dateFrom:String, dateTo:String, region:any[], groupType:String) {
    const url: string = this.apiUrl+'/google?dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&region=' + region + '&groupType=' + groupType;
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Line[])
  }

  public getRegionData() {
    const url: string = this.apiUrl+'/region';
    console.log('GET', url)
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor)
  }
}