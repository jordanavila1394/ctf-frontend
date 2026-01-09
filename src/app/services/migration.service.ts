import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/migration/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export interface MigrationDebugData {
    status: string;
    timestamp: string;
    summary: {
        distinctClientsToMigrate: number;
        distinctBranchesToMigrate: number;
        usersWithAssociatedClient: number;
        usersWithAssociatedBranch: number;
        usersWithClientId: number;
        usersWithBranchId: number;
        existingClientsInTable: number;
        existingBranchesInTable: number;
        totalUsers: number;
    };
    distinctClients: string[];
    distinctBranches: string[];
    sampleUsers: any[];
    recommendations: string[];
}

export interface BulkUpdateRequest {
    type: 'client' | 'branch';
    fromId: number;
    toId: number;
}

export interface BulkUpdateResult {
    status: string;
    message: string;
    timestamp: string;
    type: string;
    fromId: number;
    toId: number;
    fromName?: string;
    toName?: string;
    updatedUsers?: number;
}

@Injectable({
    providedIn: 'root',
})
export class MigrationService {
    constructor(private http: HttpClient) {}

    debugMigrationData(): Observable<MigrationDebugData> {
        return this.http.get<MigrationDebugData>(
            API_URL + 'debug-client-branch',
            httpOptions
        );
    }

    bulkUpdateClientBranch(data: BulkUpdateRequest): Observable<BulkUpdateResult> {
        return this.http.post<BulkUpdateResult>(
            API_URL + 'bulk-update',
            data,
            httpOptions
        );
    }
}
