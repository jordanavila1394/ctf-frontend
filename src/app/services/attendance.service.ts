import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/attendance/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class AttendanceService {
    constructor(private http: HttpClient) {}

    getAllAttendances(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'allAttendances',
            {
                idCompany,
            },
            httpOptions,
        );
    }

    getAttendanceByUser(idUser): Observable<any> {
        return this.http.post(
            API_URL + 'getAttendance',
            {
                idUser,
            },
            httpOptions,
        );
    }

    getDataAttendances(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'getDataAttendances',
            {
                idCompany,
            },
            httpOptions,
        );
    }

    createAttendance(userId, companyId, placeId, vehicleId): Observable<any> {
        return this.http.post(
            API_URL + 'createAttendance',
            {
                userId,
                companyId,
                placeId,
                vehicleId,
            },
            httpOptions,
        );
    }
    patchAttendance(id, userId): Observable<any> {
        return this.http.post(
            API_URL + 'patchAttendance',
            {
                id,
                userId,
            },
            httpOptions,
        );
    }
}
