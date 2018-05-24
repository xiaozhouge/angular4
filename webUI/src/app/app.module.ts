import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {HashLocationStrategy , LocationStrategy} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HelloComponent } from './hello/hello.component';
import { AccountComponent } from './account/account.component';
import { ReportComponent } from './report/report.component';
import { CandidatesComponent } from './candidates/candidates.component';


import {ReportService} from './report/services/report.service';
import { RequestmanagementComponent } from './requestmanagement/requestmanagement.component';

import { NZ_LOCALE, enUS } from 'ng-zorro-antd';

import { SafePipe } from  './common/SafePipe'


@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    AccountComponent,
    ReportComponent,
    CandidatesComponent,
    RequestmanagementComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
  ],
  providers: [
    ReportService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: NZ_LOCALE, useValue: enUS }
    
  ],
  bootstrap: [AppComponent,]
})
export class AppModule { }

