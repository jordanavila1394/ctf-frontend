import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { environment } from 'src/environments/environment';
import { ROUTES } from '../utils/constants';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    constructor(
        private authService: AuthService,
        public router: Router,
        public layoutService: LayoutService,
        private translateService: TranslateService,
    ) { }

    userSectionTitle;
    isProduction: any;

    ngOnInit() {
        const userRoles = this.authService.getRoles();
        this.isProduction = environment?.production;

        if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR')) {
            this.model.push({
                label: 'Dashboard',
                translationCode: 'menu.routes.dashboard.menuTitle',
                items: [
                    {
                        label: 'Dashboard',
                        translationCode: 'menu.routes.dashboard.menuTitle',
                        icon: 'pi pi-home',
                        routerLink: [ROUTES.ROUTE_DASHBOARD],
                    },
                ],
            });

            this.model.push({
                label: 'Attendances',
                translationCode: 'menu.routes.attendance.menuTitle',
                items: [
                    {
                        label: 'Attendance users list',
                        translationCode: 'menu.routes.attendance.users',
                        icon: 'pi pi-stopwatch',
                        routerLink: [ROUTES.ROUTE_USERS_ATTENDANCE],
                    },
                    {
                        label: 'Attendance list',
                        translationCode: 'menu.routes.attendance.table',
                        icon: 'pi pi-calendar',
                        routerLink: [ROUTES.ROUTE_TABLE_ATTENDANCE],
                    },
                ],
            });

            this.model.push({
                label: 'Permissions',
                translationCode: 'menu.routes.permission.menuTitle',
                items: [
                    {
                        label: 'Permission list',
                        translationCode: 'menu.routes.permission.table',
                        icon: 'pi pi-directions-alt',
                        routerLink: [ROUTES.ROUTE_TABLE_PERMISSION],
                    },
                ],
            });

            this.model.push({
                label: 'Users',
                translationCode: 'menu.routes.user.menuTitle',
                items: [
                    {
                        label: 'User list',
                        translationCode: 'menu.routes.user.table',
                        icon: 'pi pi-users',
                        routerLink: [ROUTES.ROUTE_TABLE_USER],
                    },
                    {
                        label: 'Add user',
                        translationCode: 'menu.routes.user.create',
                        icon: 'pi pi-user-plus',
                        routerLink: [ROUTES.ROUTE_CREATE_USER],
                    },
                ],
            });

            this.model.push({
                label: 'Documents',
                translationCode: 'menu.routes.documents.menuTitle',
                items: [
                    {
                        label: 'Upload documents',
                        translationCode: 'menu.routes.documents.create',
                        icon: 'pi pi-upload',
                        routerLink: [ROUTES.ROUTE_CREATE_DOCUMENT],
                    },
                    {
                        label: 'Documents',
                        translationCode: 'menu.routes.documents.table',
                        icon: 'pi pi-file-pdf',
                        routerLink: [ROUTES.ROUTE_EXPIRED_DOCUMENT],
                    },
                ],
            });

            this.model.push({
                label: 'Aziende',
                translationCode: 'menu.routes.company.menuTitle',
                items: [
                    {
                        label: 'Lista aziende',
                        translationCode: 'menu.routes.company.table',
                        icon: 'pi pi-briefcase',
                        routerLink: [ROUTES.ROUTE_TABLE_COMPANY],
                    },
                    {
                        label: 'Aggiungi azienda',
                        translationCode: 'menu.routes.company.create',
                        icon: 'pi pi-plus',
                        routerLink: [ROUTES.ROUTE_CREATE_COMPANY],
                    },
                ],
            });

            this.model.push({
                label: 'Vehicles',
                translationCode: 'menu.routes.vehicle.menuTitle',
                items: [
                    {
                        label: 'Lista veicoli',
                        translationCode: 'menu.routes.vehicle.table',
                        icon: 'pi pi-car',
                        routerLink: [ROUTES.ROUTE_TABLE_VEHICLE],
                    },
                    {
                        label: 'Aggiungi veicolo',
                        translationCode: 'menu.routes.vehicle.create',
                        icon: 'pi pi-plus-circle',
                        routerLink: [ROUTES.ROUTE_CREATE_VEHICLE],
                    },
                ],
            });
        }

        if (
            userRoles.includes('ROLE_ADMIN') ||
            userRoles.includes('ROLE_MODERATOR') ||
            userRoles.includes('ROLE_ACCOUNTING')
        ) {
            this.model.push({
                label: 'Deadlines',
                translationCode: 'menu.routes.deadlines.menuTitle',
                items: [
                    {
                        label: 'Deadlines list',
                        translationCode: 'menu.routes.deadlines.table',
                        icon: 'pi pi-clock',
                        routerLink: [ROUTES.ROUTE_TABLE_DEADLINES],
                    },
                ],
            });

            this.model.push({
                label: 'Workforce',
                translationCode: 'menu.routes.workforce.menuTitle',
                items: [
                    {
                        label: 'Workforce list',
                        translationCode: 'menu.routes.workforce.table',
                        icon: 'pi pi-briefcase',
                        routerLink: [ROUTES.ROUTE_TABLE_WORKFORCE],
                    },
                ],
            });
        }

        if (
            userRoles.includes('ROLE_WORKER') ||
            userRoles.includes('ROLE_ADMIN') ||
            userRoles.includes('ROLE_MODERATOR')
        ) {
            this.model.push({
                label: 'Landing',
                translationCode: 'menu.routes.landing.menuTitle',
                items: [
                    {
                        label: 'Landing',
                        translationCode: 'menu.routes.landing.menuTitle',
                        icon: 'pi pi-home',
                        routerLink: [ROUTES.ROUTE_LANDING_HOME],
                    },
                    {
                        label: 'Permission',
                        translationCode: 'menu.routes.landing.permission',
                        icon: 'pi pi-directions-alt',
                        routerLink: [ROUTES.ROUTE_PERMISSION_HOME],
                    },
                    {
                        label: 'Malattia',
                        translationCode: 'menu.routes.landing.medical',
                        icon: 'pi pi-heart',
                        routerLink: [ROUTES.ROUTE_MEDICAL_HOME],
                    },
                    {
                        label: 'My Attendances',
                        translationCode: 'menu.routes.landing.attendances',
                        icon: 'pi pi-stopwatch',
                        routerLink: [ROUTES.ROUTE_MYATTENDANCES_HOME],
                    },
                    {
                        label: 'Documents',
                        translationCode: 'menu.routes.landing.documents',
                        icon: 'pi pi-folder',
                        routerLink: [ROUTES.ROUTE_DOCUMENTS_HOME],
                    },
                ],
            });
        }

        this.translateMenuItems();

        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.translateService.use(event.lang);
            this.translateMenuItems();
        });
    }


    translateMenuItems() {
        this.model = this.model.map((item) => {
            if (item.label && item.translationCode) {
                item.label = this.translateService.instant(
                    item.translationCode,
                );
            }
            if (item.items) {
                for (let el of item.items) {
                    if (el.translationCode) {
                        el.label = this.translateService.instant(
                            el.translationCode,
                        );
                    }
                }
            }
            return item;
        });
    }
}
