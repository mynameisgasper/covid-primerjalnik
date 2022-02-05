import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Line } from 'src/app/models/line';
import { CovidService } from 'src/app/services/covid.service';
import { MobilityService } from 'src/app/services/mobility.service';
import { Element } from 'src/app/models/element';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { FormControl } from '@angular/forms';
import { TrafficService } from 'src/app/services/traffic.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  @ViewChild('container')
  container: ElementRef;

  minDate: Date;
  maxDate: Date;
  dateFrom: String;
  dateTo: String;

  data: any;
  summary = [];

  isRegionChosen = false;

  animations = true;

  regionForm1 = new FormControl();
  defRegion1 = "Slovenija"

  covidForm = new FormControl();
  defCovid = "0"

  transportForm = new FormControl();
  defTransport = "4"

  stm = new FormControl();
  stmShow = false;
  stmChosen = [];
  stmData: any;

  regionForm = new FormControl();
  regionShow = false;
  regionArray = [];
  regionData: any;

  dataSet1: any;
  tempDataSet1 = [];
  dataSet2: any;
  tempDataSet2 = [];

  /* Chart */
  view: [number, number];
  legendTitle = "Legenda";
  showLegend: boolean = true;
  xAxis = true;
  yAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = "Datum";
  yAxisLabel = "Število oseb";
  yAxisLabelRight = "Število";
  timeline = true;
  autoScale = true;
  colorScheme = "cool";

  comboBarScheme: Color = {
    name: 'singleLightBlue',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#01579b']
  };

  comboBarScheme2: Color = {
    name: 'horizon',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: [
        '#2597FB',
        '#65EBFD',
        '#99FDD0',
        '#FCEE4B',
        '#FEFCFA',
        '#FDD6E3',
        '#FCB1A8',
        '#EF6F7B',
        '#CB96E8',
        '#EFDEE0'
    ]
}

  constructor(private mobilityService:MobilityService, 
              private covidService:CovidService,
              private trafficService:TrafficService, 
              private route:ActivatedRoute) {
    this.view = [innerWidth / 2.25, 400];
    this.minDate = new Date(2020, 0, 15);
    this.maxDate = new Date(2021, 11, 23);
   }

  ngOnInit(): void {
    
    this.dateFrom = this.route.snapshot.queryParamMap.get('dateFrom');
    this.dateTo = this.route.snapshot.queryParamMap.get('dateTo');
    this.getSummary();
    this.getStmData();
    this.getRegionData();
    this.getCovidData(this.dateFrom, this.dateTo,"Slovenija", 0);
    this.getGoogleData(this.dateFrom, this.dateTo, this.regionArray, "");
    this.onCovidFormChange();
    this.onTransportFormChange();
    this.onStmChange();
    this.onRegionChange();
    this.onRegionChange1();
  }

  getSummary() {
    
    this.covidService.getSummary().then((result)=>{
      this.summary.push({name: "Testi na dan: PCR", value: result['testsToday'].value});
      this.summary.push({name: "Testi na dan: HAT", value: result['testsTodayHAT'].value});
      this.summary.push({name: "Novi primeri", value: result['testsToday'].subValues['positive']});
      this.summary.push({name: "Aktivni primeri", value: result['casesActive'].value});

      this.summary.push({name: "Hospitalizirani", value: result['hospitalizedCurrent'].value});
      this.summary.push({name: "Na intenzivni negi", value: result['icuCurrent'].value});
      this.summary.push({name: "Umrli", value: result['deceasedToDate'].subValues['deceased']});
      this.summary.push({name: "Polno cepljeni", value: result['vaccinationSummary'].value});
      this.data = this.summary;
    });
  }

  getCovidData(dateFrom:String, dateTo:String, region:String, column: number) {
    
    this.covidService.getCovidData(dateFrom, dateTo, region).then((result: Line[])=>{
      this.dataSet1 = this.formatResult2(result)[column].series;
      this.tempDataSet1 = JSON.parse(JSON.stringify(this.dataSet1));
    });
  }

  getGovResData(dateFrom:String, dateTo:String, column: number) {
    
    this.covidService.getGovRes(dateFrom, dateTo).then((result: Line[])=>{

      this.dataSet1 = this.formatResult2(result)[column].series;
      this.tempDataSet1 = JSON.parse(JSON.stringify(this.dataSet1));
    });
  }

  getAppleData(dateFrom:String, dateTo:String) {
    
    this.mobilityService.getAppleData(dateFrom, dateTo).then((result: Line[])=>{

      this.dataSet2 = this.formatResult(result);

      this.tempDataSet2 = this.formatResult(JSON.parse(JSON.stringify(this.dataSet2)));
    });
  }

  getGoogleData(dateFrom:String, dateTo:String, region:any[], groupType: String) {
    
    this.mobilityService.getGoogleData(dateFrom, dateTo, region, groupType).then((result: Line[])=>{

      this.dataSet2 = this.formatResult(result);
      this.tempDataSet2 = this.formatResult(JSON.parse(JSON.stringify(this.dataSet2)));
    });
  }

  getAirData(dateFrom:String, dateTo:String) {

    this.trafficService.getAirData2(dateFrom, dateTo).then((result: Line)=>{
      let series: Element[] = [];
      
      result[0].series.map(element => {
        element={name: new Date(element.name), value: element.value}
        series.push({name: new Date(element.name), value: element.value})
      });

      result[0].series = series;

      this.dataSet2 = result;   
      this.tempDataSet2 = JSON.parse(JSON.stringify(this.dataSet2));
    });
  }

  getSeaData(dateFrom:String, dateTo:String) {
    
    this.trafficService.getSeaData2(dateFrom, dateTo).then((result: Line)=>{
      let series: Element[] = [];

      result[0].series.map(element => {
        element={name: new Date(element.name), value: element.value}
        series.push({name: new Date(element.name), value: element.value === "NaN" ? null : element.value})
      });
      result[0].series = series;
      
      this.dataSet2 = result;   
      this.tempDataSet2 = JSON.parse(JSON.stringify(this.dataSet2));
    });
  }

  getRoadData(dateFrom:String, dateTo:String, stm: any[], vehicleType: string) {
    
    this.trafficService.getRoadData(dateFrom, dateTo, stm, vehicleType, null).then((result: Line[])=>{

      this.dataSet2 = this.formatResult(result);
      this.tempDataSet2 = this.formatResult(JSON.parse(JSON.stringify(this.dataSet2)));
    });
  }

  getStmData() {
    this.trafficService.getStmData().then((result)=>{

      this.stmData = result;
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
        //element={name: new Date(element.name), value: element.value}
        series.push({name: element.name, value: element.value === "NaN" ? null : element.value})
      });
      result[res].series = series;
      series = [];
    }
    return result;
  }

  formatResult2(result:Line[]) {
    let series: Element[] = [];
    for (let res in result) {
      result[res].series.map(element => {
        //element={name: new Date(element.name), value: element.value}
        series.push({name: element.name, value: element.value === "NaN" ? "0" : element.value})
      });
      result[res].series = series;
      series = [];
    }
    return result;
  }

  formatDateAndGetData(dateFrom:String, dateTo:String) {
    this.dateFrom = this.reorderDate(dateFrom);
    this.dateTo = this.reorderDate(dateTo);

    const covidDropdown = parseInt(this.covidForm.value);
    const transportDropdown = 0;

    if(covidDropdown < 10) {
      this.getCovidData(this.dateFrom, this.dateTo, this.defRegion1, covidDropdown); 
    } else {
      this.getGovResData(this.dateFrom, this.dateTo, covidDropdown-10)
    }
    const temp = parseInt(this.transportForm.value);
    if(temp === 0) {
      this.yAxisLabel = "Število vozil";
      this.stmShow = true;
      this.getRoadData(this.dateFrom, this.dateTo, this.stmChosen, "");
    } else if (temp === 1) {
      this.yAxisLabel = "Število letov";
      this.getAirData(this.dateFrom, this.dateTo);
    } else if (temp === 2) {
      this.yAxisLabel = "Število ladij";
      this.getSeaData(this.dateFrom, this.dateTo);
    } else if (temp === 3) {
      this.yAxisLabelRight = "Sprememba";
      this.getAppleData(this.dateFrom, this.dateTo);
    } else if (temp === 4) {
      this.yAxisLabelRight = "Sprememba";
      this.getGoogleData(this.dateFrom, this.dateTo, this.regionArray, "");
    }
  }

  reorderDate(date) {
    let dateArray = date.split('/').reverse();
    let temp = dateArray[1];
    dateArray[1] = dateArray[2];
    dateArray[2] = temp;
    return dateArray.join('-');
  }

  onCovidFormChange() {
    this.covidForm.valueChanges.subscribe(val => {
      this.defCovid = val;
        if(parseInt(this.defCovid) < 10) {
          this.yAxisLabel = "Število";
          this.getCovidData(this.dateFrom, this.dateTo, this.defRegion1, parseInt(this.defCovid));
        } else {
          this.yAxisLabel = "Indeks";
          this.getGovResData(this.dateFrom, this.dateTo, parseInt(this.defCovid)-10)
        }
    })
  }

  onTransportFormChange() {
    this.transportForm.valueChanges.subscribe(val => {
      this.defTransport = val;
      const temp = parseInt(this.defTransport);
      this.stmShow = false;
      this.regionShow = false;
      if(temp === 0) {
        this.yAxisLabelRight = "Število vozil";
        this.stmShow = true;
        this.getRoadData(this.dateFrom, this.dateTo, this.stmChosen, "");
      } else if (temp === 1) {
        this.yAxisLabelRight = "Število letov";
        this.getAirData(this.dateFrom, this.dateTo);
      } else if (temp === 2) {
        this.yAxisLabelRight = "Število ladij";
        this.getSeaData(this.dateFrom, this.dateTo);        
      } else if (temp === 3) {
        this.yAxisLabelRight = "Sprememba";
        this.getAppleData(this.dateFrom, this.dateTo);
      } else if (temp === 4) {
        this.regionShow = true;
        this.getGoogleData(this.dateFrom, this.dateTo, this.regionArray, "");
      }
    })
  }

  onStmChange() {
    this.stm.valueChanges.subscribe(val => {
        this.stmChosen = val;
        this.getRoadData(this.dateFrom, this.dateTo, this.stmChosen, "");
    })
  }

  deselect() {
    this.regionForm.setValue([]);
  }

  onRegionChange() {
    this.regionForm.valueChanges.subscribe(val => {
        this.regionArray = val;
          this.getGoogleData(this.dateFrom, this.dateTo, this.regionArray, "");
    })
  }

  onRegionChange1() {
    this.regionForm1.valueChanges.subscribe(val => {
      this.defRegion1 = val;
      this.isRegionChosen = false;
      if (this.defRegion1 != "Slovenija") {
        this.isRegionChosen = true;
      }
      this.getCovidData(this.dateFrom, this.dateTo, this.defRegion1, parseInt(this.defCovid));
    })
  }

  onLabelSelect(event) {
    if (event === "Število" || event === "Indeks") {

      if (this.isDataShown2(event)) {
        // Hide it
        this.tempDataSet1.some(line => {
          if (line.name === event) {
            line.series = [];
            return true;
          }
        });
      } else {
        // Show it back
        let lineToAdd = this.dataSet1.filter(line => {
          return line.name === event;
        });
        this.tempDataSet1.some(line => {
          if(line.name === event) {
            line.series = lineToAdd[0].series
          }
        });
      }
      this.tempDataSet1 = [...this.tempDataSet1]
    } else {

      if (this.isDataShown(event)) {
        // Hide it
        this.tempDataSet2.some(line => {
          if (line.name === event) {
            line.series = [];
            return true;
          }
        });
      } else {
        // Show it back
        let lineToAdd = this.dataSet2.filter(line => {
          return line.name === event;
        });
        this.tempDataSet2.some(line => {
          if(line.name === event) {
            line.series = lineToAdd[0].series
          }
        });
      }
      this.tempDataSet2 = [...this.tempDataSet2]
    }
  }

  isDataShown = (name) => {
    const selected = this.tempDataSet2.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }

  isDataShown2 = (name) => {
    const selected = this.tempDataSet1.filter(line => {
        return line.name === name && line.series[0] !== undefined;
    });
    return selected && selected.length > 0;
  }
}
