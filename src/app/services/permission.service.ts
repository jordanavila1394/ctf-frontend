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
            API_URL + 'allPermission',
            {
                idCompany,
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

    getDataPermissions(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'getDataPermissions',
            {
                idCompany,
            },
            httpOptions,
        );
    }

    createPermission(userId, companyId, typology, dates): Observable<any> {
        return this.http.post(
            API_URL + 'createPermission',
            {
                userId,
                companyId,
                typology,
                dates,
            },
            httpOptions,
        );
    }
}
