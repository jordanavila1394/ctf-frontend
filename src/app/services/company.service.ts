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
    userRole!: string;

    constructor(private http: HttpClient) {}

    getAllCompanies(): Observable<any> {
        return this.http.get(API_URL + 'allCompanies', httpOptions);
    }

    createCompany(
        name: string,
        vat: string,
        rea_number: string,
        legal_form: string,
        registered_office: string,
        head_office: string,
        phone: string,
        email: string,
        pec: string,
        website: string,
        description: string,
        userId: number,
        status: number
    ): Observable<any> {
        return this.http.post(
            API_URL + 'createCompany',
            {
                name,
                vat,
                rea_number,
                legal_form,
                registered_office,
                head_office,
                phone,
                email,
                pec,
                website,
                description,
                userId,
                status,
            },
            httpOptions
        );
    }
}
