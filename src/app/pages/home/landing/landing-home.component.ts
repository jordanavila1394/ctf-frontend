//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';

//PrimeNg

//Models

//Services
import { LayoutService } from 'src/app/layout/service/app.layout.service';

//Store
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { AuthState } from 'src/app/stores/auth/authentication.reducer';

//Libraies
import * as moment from 'moment';

//Utils
import Formatter from 'src/app/utils/formatters';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ROUTES } from 'src/app/utils/constants';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
    templateUrl: './landing-home.component.html',
    styleUrls: ['./landing-home.component.scss'],
})
export class LandingHomeComponent implements OnInit, OnDestroy {
    authState$: Observable<AuthState>;

    //Language
    locale: string;

    //Utils
    formatter!: Formatter;

    //Store
    subscription: Subscription;
    companyState$: Observable<CompanyState>;

    //Variables
    currentUser: any;
    menuItems: any;
    loading: boolean;
    attendanceData: any;

    //Global variables
    operatorPhoneNumber: any;

    constructor(
        public layoutService: LayoutService,
        private attendanceService: AttendanceService,
        public router: Router,
        private store: Store<{ authState: AuthState }>,
    ) {
        //Init
        this.operatorPhoneNumber = environment?.operatorPhoneNumber;
        this.authState$ = store.select('authState');
        this.menuItems = [
            {
                label: 'Malattia',
                source: 'assets/icons/flu.png',
                linkRoute: ROUTES.ROUTE_MEDICAL_HOME,

                icon: 'pi pi-fw pi-check',
            },
            {
                label: 'Permesso',
                source: 'assets/icons/leave.png',
                linkRoute: ROUTES.ROUTE_PERMISSION_HOME,

                icon: 'pi pi-fw pi-check',
            },
            {
                label: 'Presenze',
                source: 'assets/icons/calendar.png',
                linkRoute: ROUTES.ROUTE_MYATTENDANCES_HOME,
                icon: 'pi pi-fw pi-refresh',
            },
            {
                label: 'Documenti',
                source: 'assets/icons/stamp.png',
                linkRoute: ROUTES.ROUTE_DOCUMENTS_HOME,
                icon: 'pi pi-fw pi-trash',
            },
            {
                label: 'Guida',
                source: 'assets/icons/user-guide.png',
                linkRoute: ROUTES.ROUTE_GUIDE_HOME,
                icon: 'pi pi-fw pi-home',
            },
        ];
        this.formatter = new Formatter();
    }

    ngOnInit(): void {
        this.authState$.subscribe((authS) => {
            this.currentUser = authS?.user || '';
            this.loadServices(this.currentUser);
        });
        const layourServiceSubscription =
            this.layoutService.configUpdate$.subscribe(() => {
                this.loadServices(this.currentUser);
            });
        if (this.subscription) {
            this.subscription.add(layourServiceSubscription);
        }
    }

    loadServices(currentUser) {
        const attendanceServiceSubscription = this.attendanceService
            .getAttendanceByUser(currentUser.id)
            .subscribe((data) => {
                this.attendanceData = data;
                this.loading = false;
            });
        if (this.subscription && attendanceServiceSubscription)
            this.subscription.add(attendanceServiceSubscription);
    }
    openWhatsAppChatOperator() {
        if (this.operatorPhoneNumber) {
            const whatsappLink = `https://wa.me/${this.operatorPhoneNumber}`;
            window.open(whatsappLink, '_blank');
        }
    }
    openProfile() {
        this.router.navigate([ROUTES.ROUTE_PROFILE_HOME]);
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
