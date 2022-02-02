import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CovidComponent } from './components/covid/covid.component';
import { TrafficComponent } from './components/traffic/traffic.component';
import { MobilityComponent } from './components/mobility/mobility.component';
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboChartComponent, ComboSeriesVerticalComponent } from './components/combo-chart';

@NgModule({
  declarations: [
    BaseComponent,
    HomePageComponent,
    NavBarComponent,
    CovidComponent,
    MobilityComponent,
    TrafficComponent,
    ComboChartComponent,
    ComboSeriesVerticalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component: HomePageComponent
      },
      {
        path: 'covid',
        component: CovidComponent
      },
      {
        path: 'mobility',
        component: MobilityComponent
      },
      {
        path: 'traffic',
        component: TrafficComponent
      },
    ])
  ], 
  providers: [MatDatepickerModule,],
  bootstrap: [BaseComponent]
})
export class AppModule { }
