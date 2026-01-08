import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Branch } from '../models/branch';

const API_URL = environment.endpoint + 'api/branch/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class BranchService {
    constructor(private http: HttpClient) {}

    getAllBranches(): Observable<Branch[]> {
        return this.http.get<Branch[]>(API_URL + 'getAllBranches', httpOptions);
    }

    getBranch(id: number): Observable<Branch> {
        return this.http.get<Branch>(API_URL + 'getBranch/' + id, httpOptions);
    }

    createBranch(name: string): Observable<any> {
        return this.http.post(
            API_URL + 'createBranch',
            {
                name,
            },
            httpOptions
        );
    }

    updateBranch(id: number, name: string): Observable<any> {
        return this.http.put(
            API_URL + 'updateBranch/' + id,
            {
                name,
            },
            httpOptions
        );
    }

    deleteBranch(id: number): Observable<any> {
        return this.http.delete(API_URL + 'deleteBranch/' + id, httpOptions);
    }
}
