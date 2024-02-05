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

    getAllVehicles(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'allVehicles',
            {
                idCompany,
            },
            httpOptions,
        );
    }

    createVehicle(
        licensePlate: string,
        tipology: string,
        model: string,
        rentalType: string,
        driverType: string,
    ): Observable<any> {
        return this.http.post(
            API_URL + 'createVehicle',
            {
                licensePlate,
                tipology,
                model,
                rentalType,
                driverType,
            },
            httpOptions,
        );
    }
}
