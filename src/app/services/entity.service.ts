import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/entity/';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class EntityService {
    constructor(private http: HttpClient) {}

    getAllEntities(idCompany): Observable<any> {
        return this.http.post(
            API_URL + 'allEntities',
            {
                idCompany,
            },
            httpOptions,
        );
    }

    createEntity(
        companyId: string,
        name: string,
        identifier: string,
        payer: string,

    ): Observable<any> {
        return this.http.post(
            API_URL + 'createEntity',
            {
                companyId,
                name,
                identifier,
                payer,
            },
            httpOptions,
        );
    }
    
    updatePayerEntity(id: string, updatedData: any): Observable<any> {
        return this.http.put(
            API_URL + 'updatePayerEntity/' + id,
            updatedData,
            httpOptions
        );
    }

    deleteEntity(id): Observable<any> {
        return this.http.delete(API_URL + 'deleteEntity' + '/' + id);
    }
}
