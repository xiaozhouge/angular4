import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {CandidatesModel} from '../models/candidates.model'
@Injectable()
export class CandidatesService {
    public CandidatesListURL = window.location.origin;

	constructor(public http: HttpClient) {}
    public candidatesel(requestId: number): Observable<CandidatesModel> {
        const url = `${this.CandidatesListURL}/candidatesel?request_id=${requestId}`;
        console.log(url)
         return this.http.get<CandidatesModel>(url);
    }
    public showpdf(docid: number): Observable<CandidatesModel> {
        const url = `${this.CandidatesListURL}/showpdf/${docid}`;
        console.log(url)
         return this.http.get<CandidatesModel>(url);
    }
    public queryreqdoc(requestId: string): Observable<CandidatesModel> {
        const url = `${this.CandidatesListURL}/queryreqdoc/${requestId}`;
        console.log(url)
         return this.http.get<CandidatesModel>(url);
    }
    public processeddp(requestId: string): Observable<CandidatesModel> {
        const url = `${this.CandidatesListURL}/processeddp?request_id=${requestId}`;
        console.log(url)
         return this.http.get<CandidatesModel>(url);
    }
    public postcandidatesel(data): Observable<CandidatesModel> {
        const url = `${this.CandidatesListURL}/candidatesel`;
        return this.http.post<CandidatesModel>(url,data)
    }
    public postnearmatch(data): Observable<CandidatesModel> {
        const url = `${this.CandidatesListURL}/nearmatch`;
        return this.http.post<CandidatesModel>(url,data)
    }
    public resetcandidate(data): Observable<CandidatesModel> {
        const url = `${this.CandidatesListURL}/resetcandidate`;
        return this.http.post<CandidatesModel>(url,data)
    }
}