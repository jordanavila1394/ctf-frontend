import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../models/client';

const API_URL = environment.endpoint + 'api/client/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    constructor(private http: HttpClient) {}

    getAllClients(): Observable<Client[]> {
        return this.http.get<Client[]>(API_URL + 'getAllClients', httpOptions);
    }

    getClient(id: number): Observable<Client> {
        return this.http.get<Client>(API_URL + 'getClient/' + id, httpOptions);
    }

    createClient(name: string): Observable<any> {
        return this.http.post(
            API_URL + 'createClient',
            {
                name,
            },
            httpOptions
        );
    }

    updateClient(id: number, name: string): Observable<any> {
        return this.http.put(
            API_URL + 'updateClient/' + id,
            {
                name,
            },
            httpOptions
        );
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete(API_URL + 'deleteClient/' + id, httpOptions);
    }
}
