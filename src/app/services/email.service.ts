import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/email/';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    constructor(private http: HttpClient) {}

    sendEmail(
        recipient: string,
        subject: string,
        message: string,
    ): Observable<any> {
        const body = { recipient, subject, message };
        return this.http.post(API_URL + 'sendEmail', body);
    }
}
