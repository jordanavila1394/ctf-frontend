import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/document/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    constructor(private http: HttpClient) { }

    getDocumentsExpiring(): Observable<any> {
        return this.http.get(API_URL + 'getDocumentsExpiring', httpOptions);
    }
}
