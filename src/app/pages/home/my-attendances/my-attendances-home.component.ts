import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ROUTES } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { AuthState } from 'src/app/stores/auth/authentication.reducer';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import Formatter from 'src/app/utils/formatters';

@Component({
    templateUrl: './my-attendances-home.component.html',
    styleUrls: ['./my-attendances-home.component.scss'],
})
export class MyAttendancesHomeComponent implements OnInit, OnDestroy {
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
    monthsItems = [];
    selectedMonth: any;
    currentYear: any;

    myAttendancesForm = this.fb.group({
        currentYear: [''],
        currentMonth: [''],
    });

    constructor(
        public fb: FormBuilder,
        public layoutService: LayoutService,
        private attendanceService: AttendanceService,
        private store: Store<{ authState: AuthState }>,
    ) {
        //Init
        this.authState$ = store.select('authState');
        this.formatter = new Formatter();
    }

    ngOnInit(): void {
        //Current year
        this.myAttendancesForm.patchValue({
            currentYear: moment().year() + '',
            currentMonth: moment().month() + '',
        });

        //Current month
        this.monthsItems.push({
            name: moment().format('MMMM'),
            code: moment().month(),
        });

        //Previous month
        this.monthsItems.push({
            name: moment().subtract(1, 'month').format('MMMM'),
            code: moment().subtract(1, 'month').month(),
        });

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

    onChangeMonth(event) {
        console.log(event.value);
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

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
