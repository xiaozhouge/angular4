import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {ReportModel} from '../models/report.model'
@Injectable()
export class ReportService {
    public ReportListURL = window.location.origin;

	constructor(public http: HttpClient) {}
	public getReportList(org_id: string,year:string): Observable<ReportModel> {
		const url = `${this.ReportListURL}/querydoc?org_id=${org_id}&year=${year}`;
		console.log(url)
     	return this.http.get<ReportModel>(url);
    }
    public getAddNew(docid: string): Observable<ReportModel> {
        const url = `${this.ReportListURL}/loaddoc/${docid}`;
        return this.http.get<ReportModel>(url)
    }
    public postSubmitDoc(data: any): Observable<ReportModel> {
        const url = `${this.ReportListURL}/submitdoc`;
        return this.http.post<ReportModel>(url,data)
    }
    public getapi(){
        const url = `http://119.29.214.107:8001/`;
        return this.http.get(url)
    }
}