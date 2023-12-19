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

//Libraries
import * as FileSaver from 'file-saver';

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
    attendances: any;
    monthsItems = [];

    myAttendancesForm = this.fb.group({
        currentYear: [''],
        currentMonth: [''],
    });
    selectedCurrentMonth: any;

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
        });

        this.selectedCurrentMonth = {
            name: moment().format('MMMM'),
            code: moment().month(),
        };

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
        this.loadServices(this.currentUser);
    }

    loadServices(currentUser) {
        const currentYear =
            parseInt(this.myAttendancesForm.value.currentYear, 10) || '';
        const currentMonth = this.selectedCurrentMonth?.code || '';

        const attendanceServiceSubscription = this.attendanceService
            .getMyAttendances(currentUser.id, currentYear, currentMonth)
            .subscribe((data) => {
                this.attendances = data;
                this.attendances = data.map((attendance) => ({
                    ...attendance,
                    workedHours: attendance?.checkOut
                        ? this.formatter.formatDifferenceHours(
                              new Date(attendance?.checkOut),
                              new Date(attendance?.checkIn),
                          )
                        : 0,
                    checkIsWeekend: this.formatter.formatIsWeekendOrFestivo(
                        new Date(attendance?.checkIn),
                    ),
                }));
                this.loading = false;
            });
        if (this.subscription && attendanceServiceSubscription)
            this.subscription.add(attendanceServiceSubscription);
    }

    
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.attendances);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'presenze');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,
        );
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
