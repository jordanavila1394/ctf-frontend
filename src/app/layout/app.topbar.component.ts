import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthState } from '../stores/auth/authentication.reducer';
import { logout } from '../stores/auth/authentication.actions';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];
    authState$: Observable<AuthState>;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private store: Store<{ authState: AuthState }>
    ) {
        this.authState$ = store.select('authState');
    }
    OnClickLogout() {
        this.store.dispatch(logout());
        window.location.reload();
    }
}
