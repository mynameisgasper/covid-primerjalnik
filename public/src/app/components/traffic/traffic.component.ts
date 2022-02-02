import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from 'rxjs';
import { Element } from 'src/app/models/element';
import { Line } from 'src/app/models/line';
import { TrafficService } from 'src/app/services/traffic.service';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.css']
})
export class TrafficComponent implements OnInit {

  @ViewChild('container')
  container: ElementRef;

  dateFrom: String;
  dateTo: String;
  dateFromRoad: String = null;
  dateToRoad: String = null;
  series: Element[];

  airData: any;
  seaData: any;
  roadData: any;
  tempRoadData = [];

  stm = new FormControl();
  stmArray = [];
  stmData: any;
  
  vehicleForm1 = new FormControl();
  vehicleType = "1";
  showVehicleType = false;

  /* Chart */
  view: [number, number];
  legendTitle = "Legenda";
  showLegend: boolean = true;
  xAxis = true;
  yAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = "Datum";
  yAxisLabel = "Št. letov";
  yAxisLabelSea = "Št. ladij";
  yAxisLabelRoad = "Št. vozil";
  timeline = true;
  autoScale = true;
  colorScheme = "cool";
  

  constructor(private trafficService:TrafficService, private route:ActivatedRoute) { 
    this.view = [innerWidth / 1.5, 400];
  }

  ngOnInit(): void {
    this.dateFrom = this.route.snapshot.queryParamMap.get('dateFrom');
    this.dateTo = this.route.snapshot.queryParamMap.get('dateTo');
    this.dateFromRoad = this.route.snapshot.queryParamMap.get('dateFromRoad');
    this.dateToRoad = this.route.snapshot.queryParamMap.get('dateToRoad');
    this.getAirData(this.dateFrom, this.dateTo);
    this.getSeaData(this.dateFrom, this.dateTo);
    this.getRoadData(this.dateFromRoad, this.dateToRoad, [], "");
    this.getStmData();
    this.onStmChange();
    this.onVehicleTypeChange();
  }

  getAirData(dateFrom:String, dateTo:String) {

    this.trafficService.getAirData(dateFrom, dateTo).then((result: Line)=>{
      let series: Element[] = [];
      
      result[0].series.map(element => {
        series.push({name: new Date(element.name), value: element.value})
      });

      result[0].series = series;

      this.airData = result;   
    });
  }

  getSeaData(dateFrom:String, dateTo:String) {
    
    this.trafficService.getSeaData(dateFrom, dateTo).then((result: Line)=>{
      let series: Element[] = [];

      result[0].series.map(element => {
        series.push({name: new Date(element.name), value: element.value === "NaN" ? "0" : element.value})
      });
      result[0].series = series;
      this.seaData = result;
    });
  }

  getRoadData(dateFrom:String, dateTo:String, stm: any[], vehicleType: string) {
    
    this.trafficService.getRoadData(dateFrom, dateTo, stm, vehicleType, "page").then((result: Line[])=>{

      this.roadData = this.formatResult(result);
      this.tempRoadData = this.formatResult(JSON.parse(JSON.stringify(this.roadData)));
    });
  }

  getStmData() {
    this.trafficService.getStmData().then((result)=>{

      this.stmData = result;
    });
  }

  formatResult(result:Line[]) {
    let series: Element[] = [];
    for (let res in result) {
      //Če je STM imamo številko zato jo zmappamo v ime STM za legendo
      if (!isNaN(Number(result[res].name))){
        const stm = this.stmData.filter(element => {
          console.log(element)
          if (element.id == result[res].name) {
            result[res].name = element.name;
          }
        });
      }

      result[res].series.map(element => {
        element={name: new Date(element.name), value: element.value}
        series.push({name: new Date(element.name), value: element.value})
      });
      result[res].series = series;
      series = [];
    }
    return result;
  }

  formatDateAndGetAirData(dateFrom:String, dateTo:String) {
    dateFrom = this.reorderDate(dateFrom);
    dateTo = this.reorderDate(dateTo);
    this.getAirData(dateFrom, dateTo);
  }

  formatDateAndGetSeaData(dateFrom:String, dateTo:String) {
    dateFrom = this.reorderDate(dateFrom);
    dateTo = this.reorderDate(dateTo);
    this.getSeaData(dateFrom, dateTo);
  }

  formatDateAndGetRoadData(dateFrom:String, dateTo:String) {
    this.dateFromRoad = this.reorderDate(dateFrom);
    this.dateToRoad = this.reorderDate(dateTo);
    this.getRoadData(this.dateFromRoad, this.dateToRoad, this.stmArray, "");
  }

  reorderDate(date) {
    let dateArray = date.split('/').reverse();
    let temp = dateArray[1];
    dateArray[1] = dateArray[2];
    dateArray[2] = temp;
    return dateArray.join('-');
  }

  onResize(event) {
    this.view = [this.container.nativeElement.offsetWidth, 400];
  }

  onLabelSelect(event) {
    if (this.isDataShown(event)) {
      // Hide it
      this.tempRoadData.some(line => {
        if (line.name === event) {
          line.series = [];
          return true;
        }
      });
    } else {
      // Show it back
      let lineToAdd = this.roadData.filter(line => {
        return line.name === event;
      });
      this.tempRoadData.some(line => {
        if(line.name === event) {
          line.series = lineToAdd[0].series
        }
      });
    }
    this.tempRoadData = [...this.tempRoadData]
  }

  isDataShown = (name) => {
    const selected = this.tempRoadData.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }

  deselect() {
    this.stm.setValue([]);
  }

  onStmChange() {
    this.stm.valueChanges.subscribe(val => {
        this.stmArray = val;
        if(this.stmArray.length < 2) {
          this.showVehicleType = false;
          this.getRoadData(this.dateFromRoad, this.dateToRoad, this.stmArray, "");
        } else {
          this.showVehicleType = true;
          this.getRoadData(this.dateFromRoad, this.dateToRoad, this.stmArray, this.vehicleType);
        }
    })
  }

  onVehicleTypeChange() {
    this.vehicleForm1.valueChanges.subscribe(val => {
      this.vehicleType = val;
      this.getRoadData(this.dateFromRoad, this.dateToRoad, this.stmArray, this.vehicleType);
    })
  }
}
