import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/download/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class DownloadService {
    constructor(private http: HttpClient) {}

    getDocumentsByUser(idUser, fiscalCode): Observable<any> {
        return this.http.post(
            API_URL + 'getDocumentsByUser',
            {
                idUser,
                fiscalCode,
            },
            httpOptions,
        );
    }

    getWorkDocumentsByUser(idUser, fiscalCode): Observable<any> {
        return this.http.post(
            API_URL + 'getWorkDocumentsByUser',
            {
                idUser,
                fiscalCode,
            },
            httpOptions,
        );
    }
}
