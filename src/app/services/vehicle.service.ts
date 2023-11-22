import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/vehicle/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    constructor(private http: HttpClient) {}

    getAllVehicles(): Observable<any> {
        return this.http.get(API_URL + 'allVehicles', httpOptions);
    }
}
