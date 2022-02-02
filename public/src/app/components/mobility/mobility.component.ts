import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Line } from 'src/app/models/line';
import { Element } from 'src/app/models/element';
import { MobilityService } from 'src/app/services/mobility.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mobility',
  templateUrl: './mobility.component.html',
  styleUrls: ['./mobility.component.css']
})
export class MobilityComponent implements OnInit {

  @ViewChild('container')
  container: ElementRef;

  dateFrom: String;
  dateTo: String;
  dateFromGoogle: String = null;
  dateToGoogle: String = null;

  appleData: any;
  tempAppleData = [];
  googleData: any;
  tempGoogleData = [];

  regionForm = new FormControl();
  regionArray = [];
  regionData: any;

  groupType = new FormControl();
  groupTypeChosen = "0";
  showGroupType = false;

  /* Chart */
  view: [number, number];
  legendTitle = "Legenda";
  showLegend: boolean = true;
  xAxis = true;
  yAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = "Datum";
  yAxisLabel = "Sprememba";
  timeline = true;
  autoScale = true;
  colorScheme = "cool";

  constructor(private mobilityService:MobilityService, private route:ActivatedRoute) { 
    this.view = [innerWidth / 1.5, 400];
  }

  ngOnInit(): void {
    this.dateFrom = this.route.snapshot.queryParamMap.get('dateFrom');
    this.dateTo = this.route.snapshot.queryParamMap.get('dateTo');
    this.dateFromGoogle = this.route.snapshot.queryParamMap.get('dateFromGoogle');
    this.dateToGoogle = this.route.snapshot.queryParamMap.get('dateToGoogle');
    this.getAppleData(this.dateFrom, this.dateTo);
    this.getRegionData();
    this.onRegionChange();
    this.getGoogleData(this.dateFromGoogle, this.dateToGoogle, [], "");
    this.onGroupTypeChange()
  }

  getAppleData(dateFrom:String, dateTo:String) {
    
    this.mobilityService.getAppleData(dateFrom, dateTo).then((result: Line[])=>{

      this.appleData = this.formatResult(result);
      this.tempAppleData = this.formatResult(JSON.parse(JSON.stringify(this.appleData)));
    });
  }

  getGoogleData(dateFrom:String, dateTo:String, region:any[], groupType: String) {
    
    this.mobilityService.getGoogleData(dateFrom, dateTo, region, groupType).then((result: Line[])=>{

      this.googleData = this.formatResult(result);
      this.tempGoogleData = this.formatResult(JSON.parse(JSON.stringify(this.googleData)));
    });
  }

  getRegionData() {
    this.mobilityService.getRegionData().then((result)=>{

      for (let res in result) {
        if (result[res].sub_region1.startsWith('Administrative unit ')) {
          result[res].sub_region1 = result[res].sub_region1.substring(20);
        } else if (result[res].sub_region1.startsWith('Municipality of ')) {
          result[res].sub_region1 = result[res].sub_region1.substring(16);
        }
      }
      this.regionData = result;
    });
  }

  formatResult(result:Line[]) {
    let series: Element[] = [];
    for (let res in result) {
      result[res].series.map(element => {
        element={name: new Date(element.name), value: element.value}
        series.push({name: new Date(element.name), value: element.value === "NaN" ? null : element.value})
      });
      result[res].series = series;
      series = [];
    }
    return result;
  }

  formatDateAndGetAppleData(dateFrom:String, dateTo:String) {
    dateFrom = this.reorderDate(dateFrom);
    dateTo = this.reorderDate(dateTo);
    this.getAppleData(dateFrom, dateTo);
  }

  formatDateAndGetGoogleData(dateFrom:String, dateTo:String) {
    this.dateFromGoogle = this.reorderDate(dateFrom);
    this.dateToGoogle = this.reorderDate(dateTo);
    this.getGoogleData(this.dateFromGoogle, this.dateToGoogle, this.regionArray, "");
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
      this.tempAppleData.some(line => {
        if (line.name === event) {
          line.series = [];
          return true;
        }
      });
    } else {
      // Show it back
      let lineToAdd = this.appleData.filter(line => {
        return line.name === event;
      });
      this.tempAppleData.some(line => {
        if(line.name === event) {
          line.series = lineToAdd[0].series
        }
      });
    }
    this.tempAppleData = [...this.tempAppleData]
  }

  isDataShown = (name) => {
    const selected = this.tempAppleData.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }

  onLabelSelect2(event) {
    if (this.isDataShown2(event)) {
      // Hide it
      this.tempGoogleData.some(line => {
        if (line.name === event) {
          line.series = [];
          return true;
        }
      });
    } else {
      // Show it back
      let lineToAdd = this.googleData.filter(line => {
        return line.name === event;
      });
      this.tempGoogleData.some(line => {
        if(line.name === event) {
          line.series = lineToAdd[0].series
        }
      });
    }
    this.tempGoogleData = [...this.tempGoogleData]
  }

  isDataShown2 = (name) => {
    const selected = this.tempGoogleData.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }

  deselect() {
    this.regionForm.setValue([]);
  }

  onRegionChange() {
    this.regionForm.valueChanges.subscribe(val => {
        this.regionArray = val;
        if(this.regionArray.length < 2) {
          this.showGroupType = false;
          this.getGoogleData(this.dateFromGoogle, this.dateToGoogle, this.regionArray, "");
        } else {
          this.showGroupType = true;
          this.getGoogleData(this.dateFromGoogle, this.dateToGoogle, this.regionArray, this.groupTypeChosen);
        }
    })
  }

  onGroupTypeChange() {
    this.groupType.valueChanges.subscribe(val => {
      this.groupTypeChosen = val;
      this.getGoogleData(this.dateFromGoogle, this.dateToGoogle, this.regionArray, this.groupTypeChosen);
    })
  }
}
