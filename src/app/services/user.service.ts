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
    constructor(private http: HttpClient) { }

    getAllCeos(): Observable<any> {
        return this.http.get(API_URL + 'allCeos', httpOptions);
    }

    getAllAssociatedClients(): Observable<any> {
        return this.http.get(API_URL + 'getAllAssociatedClients', httpOptions);
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

    getAllUsersWithAttendances(idCompany, year, month): Observable<any> {
        return this.http.post(
            API_URL + 'allUsersWithAttendances',
            {
                idCompany,
                year,
                month,
            },
            httpOptions,
        );
    }
    getUser(id: string): Observable<any> {
        return this.http.get(API_URL + 'getUser' + '/' + id);
    }

    checkIfExistUser(fiscalCode: string): Observable<any> {
        return this.http.post(
            API_URL + 'checkIfExistUser',
            {
                fiscalCode,
            },
            httpOptions,
        );
    }

    createUser(
        fiscalCode: string,
        password: string,
        name: string,
        surname: string,
        email: string,
        cellphone: string,
        roleId: string,
        companyId: string,
        workerNumber: string,
        associatedClient: string,
        position: string,
        address: string,
        iban: string,
        birthCountry: string,
        birthDate: string,
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
                cellphone,
                roleId,
                companyId,
                workerNumber,
                associatedClient,
                position,
                address,
                iban,
                birthCountry,
                birthDate,
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
        cellphone: string,
        roleId: string,
        companyId: string,
        workerNumber: string,
        associatedClient: string,
        position: string,
        address: string,
        iban: string,
        birthCountry: string,
        birthDate: string,
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
                cellphone,
                roleId,
                companyId,
                workerNumber,
                associatedClient,
                position,
                address,
                iban,
                birthCountry,
                birthDate,
                status,
            },
            httpOptions,
        );
    }

    saveProfileUser(
        id: number,
        name: string,
        surname: string,
        fiscalCode: string,
        email: string,
        cellphone: string,
        address: string,
        iban: string,
        birthCountry: string,
        birthDate: string,
    ): Observable<any> {
        return this.http.patch(
            API_URL + 'saveProfileUser',
            {
                id,
                name,
                surname,
                fiscalCode,
                email,
                cellphone,
                address,
                iban,
                birthCountry,
                birthDate,
            },
            httpOptions,
        );
    }

    saveNewPassword(id: number, password: string): Observable<any> {
        return this.http.patch(
            API_URL + 'saveNewPassword',
            {
                id,
                password,
            },
            httpOptions,
        );
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(API_URL + 'deleteUser' + '/' + id);
    }
}
