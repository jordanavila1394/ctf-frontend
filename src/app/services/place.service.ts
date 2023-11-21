import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/place/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    constructor(private http: HttpClient) {}

    getPlacesByCompany(id: string): Observable<any> {
        return this.http.get(
            API_URL + 'getPlacesByCompany' + '/' + id,
            httpOptions
        );
    }

    createPlace(
        name: string,
        address: string,
        latitude: string,
        longitude: string,
        googlePlaceId: string,
        url: string,
        companyId: number,
        description: string
    ): Observable<any> {
        return this.http.post(
            API_URL + 'createPlace',
            {
                name,
                address,
                latitude,
                longitude,
                googlePlaceId,
                url,
                companyId,
                description,
            },
            httpOptions
        );
    }
}
