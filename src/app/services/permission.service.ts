import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/permission/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    constructor(private http: HttpClient) {}

    getAllPermissions(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'allPermissions',
            {
                idCompany,
            },
            httpOptions,
        );
    }
    getPermissionById(idPermission): Observable<any> {
        return this.http.post(
            API_URL + 'getPermissionById',
            {
                idPermission,
            },
            httpOptions,
        );
    }
    getPermissionByUser(idUser): Observable<any> {
        return this.http.post(
            API_URL + 'getPermission',
            {
                idUser,
            },
            httpOptions,
        );
    }

    getMyPermissions(idUser, year, month): Observable<any> {
        return this.http.post(
            API_URL + 'getMyPermissions',
            {
                idUser,
                year,
                month,
            },
            httpOptions,
        );
    }

    getPermissionsByClient(associatedClient, startDate, endDate): Observable<any> {
        return this.http.post(
            API_URL + 'permissionsByClient',
            {
                associatedClient,
                startDate,
                endDate
            },
            httpOptions,
        );
    }

    getMyMedicalLeave(idUser, year, month): Observable<any> {
        return this.http.post(
            API_URL + 'getMyMedicalLeave',
            {
                idUser,
                year,
                month,
            },
            httpOptions,
        );
    }

    getDataPermissions(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'getDataPermissions',
            {
                idCompany,
            },
            httpOptions,
        );
    }

    addProtocolNumberPermission(
        idPermission,
        note,
        protocolNumber,
    ): Observable<any> {
        return this.http.post(
            API_URL + 'addProtocolNumberPermission',
            {
                idPermission,
                note,
                protocolNumber,
            },
            httpOptions,
        );
    }

    createPermission(
        userId,
        companyId,
        typology,
        dates,
        hours,
        note,
    ): Observable<any> {
        return this.http.post(
            API_URL + 'createPermission',
            {
                userId,
                companyId,
                typology,
                dates,
                hours,
                note,
            },
            httpOptions,
        );
    }
    rejectPermission(id, userId): Observable<any> {
        return this.http.post(
            API_URL + 'rejectPermission',
            {
                id,
                userId,
            },
            httpOptions,
        );
    }

    approvePermission(id, userId): Observable<any> {
        return this.http.post(
            API_URL + 'approvePermission',
            {
                id,
                userId,
            },
            httpOptions,
        );
    }
    
}
