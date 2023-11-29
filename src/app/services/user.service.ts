import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/user/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

    getAllCeos(): Observable<any> {
        return this.http.get(API_URL + 'allCeos', httpOptions);
    }

    getAllCeosByCompany(id: string): Observable<any> {
        return this.http.get(API_URL + 'allCeosByCompany' + '/' + id);
    }

    getAllUsers(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'allUsers',
            {
                idCompany,
            },
            httpOptions,
        );
    }

    getUser(id: string): Observable<any> {
        return this.http.get(API_URL + 'getUser' + '/' + id);
    }

    createUser(
        fiscalCode: string,
        password: string,
        name: string,
        surname: string,
        email: string,
        roleId: string,
        companyId: string,
        workerNumber: string,
        position: string,
        status: boolean,
    ): Observable<any> {
        return this.http.post(
            API_URL + 'createUser',
            {
                fiscalCode,
                password,
                name,
                surname,
                email,
                roleId,
                companyId,
                workerNumber,
                position,
                status,
            },
            httpOptions,
        );
    }

    patchUser(
        id: number,
        name: string,
        surname: string,
        fiscalCode: string,
        email: string,
        roleId: string,
        companyId: string,
        workerNumber: string,
        position: string,
        status: boolean,
    ): Observable<any> {
        return this.http.patch(
            API_URL + 'patchUser' + '/' + id,
            {
                id,
                name,
                surname,
                fiscalCode,
                email,
                roleId,
                companyId,
                workerNumber,
                position,
                status,
            },
            httpOptions,
        );
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(API_URL + 'deleteUser' + '/' + id);
    }
}
