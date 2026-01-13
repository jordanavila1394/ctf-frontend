//Angular
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

//Libraries
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

//PrimeNg
import { MessageService, ConfirmationService, MenuItem, FilterService } from 'primeng/api';
import { Table } from 'primeng/table';

//Services
import { CompanyService } from 'src/app/services/company.service';
import { AttendanceService } from 'src/app/services/attendance.service';

//Models
import { Company } from 'src/app/models/company';

//Utils
import { ROUTES } from 'src/app/utils/constants';

//Store
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
    templateUrl: './table-attendance.component.html',
    styleUrls: ['./table-attendance.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TableAttendanceComponent implements OnInit, OnDestroy {
    attendances: any[] = [];

    rowGroupMetadata: any;

    loading: boolean = true;

    actionsFrozen: boolean = true;

    idCompany: any;
    companyState$: Observable<CompanyState>;
    selectedCompany: any;
    subscription: Subscription = new Subscription();

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private attendanceService: AttendanceService,
        private store: Store<{ companyState: CompanyState }>,
        private filterService: FilterService,
    ) {
        this.companyState$ = store.select('companyState');
        
        // Register custom date-only filter
        this.filterService.register('dateOnly', (value: any, filter: any): boolean => {
            if (!filter) {
                return true;
            }
            if (!value) {
                return false;
            }
            
            // Ensure both are Date objects
            const valueDate = value instanceof Date ? value : new Date(value);
            const filterDate = filter instanceof Date ? filter : new Date(filter);
            
            // Compare only date part (ignore time)
            return (
                valueDate.getFullYear() === filterDate.getFullYear() &&
                valueDate.getMonth() === filterDate.getMonth() &&
                valueDate.getDate() === filterDate.getDate()
            );
        });
    }

    ngOnInit(): void {
        const companyServiceSubscription = this.companyState$.subscribe(
            (company) => {
                this.selectedCompany = company?.currentCompany;
                this.loadServices(this.selectedCompany);
            },
        );
        this.subscription.add(companyServiceSubscription);
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
    //Services
    loadServices(selectedCompany) {
        const attendanceServiceSubscription = this.attendanceService
            .getAllAttendances(selectedCompany.id)
            .subscribe((attendances) => {
                this.attendances = attendances.map((attendance) => {
                    let newAttendance = attendance;
                    newAttendance.company = attendance?.user?.companies[0];
                    // Convert date strings to Date objects for PrimeNG filters
                    if (newAttendance.checkIn) {
                        newAttendance.checkIn = new Date(newAttendance.checkIn);
                    }
                    if (newAttendance.checkOut) {
                        newAttendance.checkOut = new Date(newAttendance.checkOut);
                    }
                    return newAttendance;
                });

                this.loading = false;
            });
        if (this.subscription && attendanceServiceSubscription)
            this.subscription.add(attendanceServiceSubscription);
    }

    //Dialog
    confirmErase(event: Event, idCompany) {
        this.confirmationService.confirm({
            key: 'confirmErase',
            target: event.target || new EventTarget(),
            message: 'Sei sicuro di voler eliminare?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confermato',
                    detail: 'Hai accettato',
                });
                this.companyService
                    .deleteCompany(idCompany)
                    .subscribe((res) =>
                        this.loadServices(this.selectedCompany),
                    );
            },
            reject: () => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Rifiutato',
                    detail: 'Hai rifiutato',
                });
            },
        });
    }

    //Change route

    goToModifyAttendance(idCompany) {
        this.router.navigate([ROUTES.ROUTE_MODIFY_ATTENDANCE], {
            queryParams: { id: idCompany },
        });
    }

    goToDetailAttendance(idCompany) {
        this.router.navigate([ROUTES.ROUTE_DETAIL_ATTENDANCE], {
            queryParams: { id: idCompany },
        });
    }

    //Table
    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains',
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }


}
