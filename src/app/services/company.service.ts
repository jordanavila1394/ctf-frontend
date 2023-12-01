import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/company/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class CompanyService {

    constructor(private http: HttpClient) {}

    getAllCompanies(): Observable<any> {
        return this.http.get(API_URL + 'allCompanies', httpOptions);
    }

    getCompany(id: string): Observable<any> {
        return this.http.get(API_URL + 'getCompany' + '/' + id);
    }

    createCompany(
        name: string,
        vat: string,
        reaNumber: string,
        legalForm: string,
        registeredOffice: string,
        headOffice: string,
        phone: string,
        email: string,
        pec: string,
        website: string,
        description: string,
        status: boolean
    ): Observable<any> {
        return this.http.post(
            API_URL + 'createCompany',
            {
                name,
                vat,
                reaNumber,
                legalForm,
                registeredOffice,
                headOffice,
                phone,
                email,
                pec,
                website,
                description,
                status,
            },
            httpOptions
        );
    }

    patchCompany(
        id: string,
        name: string,
        vat: string,
        reaNumber: string,
        legalForm: string,
        registeredOffice: string,
        headOffice: string,
        phone: string,
        email: string,
        pec: string,
        website: string,
        description: string,
        ceoId: number,
        status: boolean
    ): Observable<any> {
        return this.http.patch(
            API_URL + 'patchCompany' + '/' + id,
            {
                name,
                vat,
                reaNumber,
                legalForm,
                registeredOffice,
                headOffice,
                phone,
                email,
                pec,
                website,
                description,
                ceoId,
                status,
            },
            httpOptions
        );
    }

    deleteCompany(id: string): Observable<any> {
        return this.http.delete(API_URL + 'deleteCompany' + '/' + id);
    }
}
