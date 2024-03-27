import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/deadlines/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class DeadlinesService {
    constructor(private http: HttpClient) {}

    allDeadlines(idCompany, year, months): Observable<any> {
        return this.http.post(
            API_URL + 'allDeadlines',
            {
                idCompany,
                year,
                months,
            },
            httpOptions,
        );
    }
    changeStatusDeadline(id, status): Observable<any> {
        return this.http.post(
            API_URL + 'changeStatusDeadline',
            {
                id,
                status,
            },
            httpOptions,
        );
    }
    monthlySummary(idCompany, year, months): Observable<any> {
        return this.http.post(
            API_URL + 'monthlySummary',
            {
                idCompany,
                year,
                months,
            },
            httpOptions,
        );
    }
}
