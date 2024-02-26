import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/upload/';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    constructor(private http: HttpClient) {}

    uploadAttendanceImages(formData: FormData) {
        return this.http.post(API_URL + 'uploadAttendanceImages', formData);
    }

    uploadDocuments(formData: FormData) {
        return this.http.post(API_URL + 'uploadDocuments', formData);
    }

    deleteDocument(file: string) {
        return this.http.post(API_URL + 'deleteDocument', { key: file });
    }
}
