import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Observable, finalize, race, timer, filter } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();

        const request$ = next.handle(req);
        const timeout$ = timer(10000);

        return race([request$, timeout$]).pipe(
            // Filtro solo HttpEvent (evita che passi il valore "0" del timer)
            filter((event): event is HttpEvent<any> => typeof event !== 'number'),
            finalize(() => this.loaderService.hide())
        );
    }
}
