import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {RequestmanagementModel} from '../models/requestmanagement.model'
@Injectable()
export class RequestmanagementService {
	public ReportListURL = window.location.origin;
	constructor(public http: HttpClient) {
		// code...
	}
    public queryreq(startDate: string,endDate:string): Observable<RequestmanagementModel> {
        const url = `${this.ReportListURL}/queryreq?startDate=${startDate}&endDate=${endDate}`;
        // console.log(url)
         return this.http.get<RequestmanagementModel>(url);
    }
    public queryreqdoc(requestId: string): Observable<RequestmanagementModel> {
        const url = `${this.ReportListURL}/queryreqdoc/${requestId}`;
        // console.log(url)
         return this.http.get<RequestmanagementModel>(url);
    }
}