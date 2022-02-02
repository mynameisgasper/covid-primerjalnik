import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Line } from 'src/app/models/line';
import { Element } from 'src/app/models/element';
import { CovidService } from 'src/app/services/covid.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css']
})
export class CovidComponent implements OnInit {

  @ViewChild('container')
  container: ElementRef;

  dateFrom: String;
  dateTo: String;

  covidData: any;
  tempCovidData = [];

  covidToDateData: any;
  tempCovidToDateData = [];

  regionForm1 = new FormControl();
  defRegion1 = "Slovenija"

  regionForm = new FormControl();
  defRegion = "Slovenija"

  govResData: any;
  tempGovResData = [];

  /* Chart */
  view: [number, number];
  legendTitle = "Legenda";
  showLegend: boolean = true;
  xAxis = true;
  yAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = "Datum";
  yAxisLabel = "Število";
  timeline = true;
  autoScale = true;
  colorScheme = "cool";

  constructor(private covidService:CovidService, private route:ActivatedRoute) {
    this.view = [innerWidth / 1.5, 400];
  }

  ngOnInit(): void {
    this.dateFrom = this.route.snapshot.queryParamMap.get('dateFrom');
    this.dateTo = this.route.snapshot.queryParamMap.get('dateTo');
    this.getCovidData(this.dateFrom, this.dateTo, '');
    this.getCovidToDateData(this.dateFrom, this.dateTo, '');
    this.onRegionChange();
    this.onRegionChange1();
    this.getGovResData(this.dateFrom, this.dateTo);
  }

  getCovidData(dateFrom:String, dateTo:String, region:String) {
    
    this.covidService.getCovidData(dateFrom, dateTo, region).then((result: Line[])=>{

      this.covidData = this.formatResult(result);
      this.tempCovidData = this.formatResult(JSON.parse(JSON.stringify(this.covidData)));
    });
  }

  getCovidToDateData(dateFrom:String, dateTo:String, region:String) {

    this.covidService.getCovidToDateData(dateFrom, dateTo, region).then((result: Line[])=>{

      this.covidToDateData = this.formatResult(result);
      this.tempCovidToDateData = this.formatResult(JSON.parse(JSON.stringify(this.covidToDateData)));
    });
  }

  getGovResData(dateFrom:String, dateTo:String) {
    
    this.covidService.getGovRes(dateFrom, dateTo).then((result: Line[])=>{
      console.log(result)
      this.govResData = this.formatResult(result);
      this.tempGovResData = this.formatResult(JSON.parse(JSON.stringify(this.govResData)));
    });
  }
  
  formatResult(result:Line[]) {
    let series: Element[] = [];
    for (let res in result) {
      result[res].series.map(element => {
        element={name: new Date(element.name), value: element.value}
        series.push({name: new Date(element.name), value: element.value === "NaN" ? "0" : element.value})
      });
      result[res].series = series;
      series = [];
    }
    return result;
  }

  formatDateAndGetCovidData(dateFrom:String, dateTo:String) {
    dateFrom = this.reorderDate(dateFrom);
    dateTo = this.reorderDate(dateTo);
    this.getCovidData(dateFrom, dateTo, this.defRegion1);
  }

  formatDateAndGetCovidToDateData(dateFrom:String, dateTo:String) {
    dateFrom = this.reorderDate(dateFrom);
    dateTo = this.reorderDate(dateTo);
    this.getCovidToDateData(dateFrom, dateTo, this.defRegion);
  }

  formatDateAndGetGovResData(dateFrom:String, dateTo:String) {
    dateFrom = this.reorderDate(dateFrom);
    dateTo = this.reorderDate(dateTo);
    this.getGovResData(dateFrom, dateTo);
  }

  reorderDate(date) {
    let dateArray = date.split('/').reverse();
    let temp = dateArray[1];
    dateArray[1] = dateArray[2];
    dateArray[2] = temp;
    return dateArray.join('-');
  }

  onLabelSelect(event) {
    if (this.isDataShown(event)) {
      // Hide it
      this.tempCovidData.some(line => {
        if (line.name === event) {
          line.series = [];
          return true;
        }
      });
    } else {
      // Show it back
      let lineToAdd = this.covidData.filter(line => {
        return line.name === event;
      });
      this.tempCovidData.some(line => {
        if(line.name === event) {
          line.series = lineToAdd[0].series
        }
      });
    }
    this.tempCovidData = [...this.tempCovidData]
  }

  isDataShown = (name) => {
    const selected = this.tempCovidData.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }

  onLabelSelect2(event) {
    if (this.isDataShown2(event)) {
      // Hide it
      this.tempCovidToDateData.some(line => {
        if (line.name === event) {
          line.series = [];
          return true;
        }
      });
    } else {
      // Show it back
      let lineToAdd = this.covidToDateData.filter(line => {
        return line.name === event;
      });
      this.tempCovidToDateData.some(line => {
        if(line.name === event) {
          line.series = lineToAdd[0].series
        }
      });
    }
    this.tempCovidToDateData = [...this.tempCovidToDateData]
  }

  isDataShown2 = (name) => {
    const selected = this.tempCovidToDateData.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }

  onLabelSelect3(event) {
    if (this.isDataShown2(event)) {
      // Hide it
      this.tempGovResData.some(line => {
        if (line.name === event) {
          line.series = [];
          return true;
        }
      });
    } else {
      // Show it back
      let lineToAdd = this.govResData.filter(line => {
        return line.name === event;
      });
      this.tempGovResData.some(line => {
        if(line.name === event) {
          line.series = lineToAdd[0].series
        }
      });
    }
    this.tempGovResData = [...this.tempGovResData]
  }

  isDataShown3 = (name) => {
    const selected = this.tempGovResData.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }

  onResize(event) {
    this.view = [this.container.nativeElement.offsetWidth, 400];
  }

  onRegionChange() {
    this.regionForm.valueChanges.subscribe(val => {
      this.defRegion = val;
      this.getCovidToDateData(this.dateFrom, this.dateTo, this.defRegion);
    })
  }

  onRegionChange1() {
    this.regionForm1.valueChanges.subscribe(val => {
      this.defRegion1 = val;
      this.getCovidData(this.dateFrom, this.dateTo, this.defRegion1);
    })
  }
  /*
  public styleVerticalAxis(tick) {
    var day = new Date(tick);
    var epidemyStart = new Date('2020-03-12');
    console.log(epidemyStart.getDate());
    console.log(day.getDate);
    return {stroke: '#fff'};
  }*/
}
