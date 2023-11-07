import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const currentState = localStorage?.getItem('state');
        const objState = JSON.parse(currentState ? currentState : '');
        const token = objState?.authState?.user?.accessToken;
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    'x-access-token': `${token}`,
                },
            });
        }

        return next.handle(request);
    }
}
