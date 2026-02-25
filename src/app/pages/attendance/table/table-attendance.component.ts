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
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

//Models
import { Company } from 'src/app/models/company';

//Utils
import { ROUTES } from 'src/app/utils/constants';

//Store
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

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
    isPrepost: boolean = false;
    userLoggedInBranchId: number | null = null;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private attendanceService: AttendanceService,
        private userService: UserService,
        private authService: AuthService,
        private store: Store<any>,
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
        // First, detect if user is Preposto and get their branchId
        this.store.select('authState').pipe(
            filter(authState => authState && authState.user),
            takeUntil(this.ngUnsubscribe)
        ).subscribe(authState => {
            const loggedInUser = authState.user;
            console.log('👤 Logged in user:', loggedInUser);
            
            if (loggedInUser) {
                // Check if user has Preposto role
                if (loggedInUser.roles && Array.isArray(loggedInUser.roles)) {
                    this.isPrepost = loggedInUser.roles.some(role => 
                        role === 'ROLE_PREPOSTO' || role === 'Preposto' || role === 'PREPOSTO'
                    );
                    console.log('🏢 Is Preposto:', this.isPrepost);
                }
                
                // Fetch complete user data to get branchId
                this.userService.getUser(loggedInUser.id).pipe(
                    takeUntil(this.ngUnsubscribe)
                ).subscribe({
                    next: (userData) => {
                        console.log('📋 Complete user data:', userData);
                        this.userLoggedInBranchId = userData.branchId;
                        console.log('🏪 User branch ID from API:', this.userLoggedInBranchId);
                    },
                    error: (err) => {
                        console.error('❌ Error fetching complete user data:', err);
                    }
                });
            }
        });

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
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    //Services
    loadServices(selectedCompany) {
        const attendanceServiceSubscription = this.attendanceService
            .getAllAttendances(selectedCompany.id)
            .subscribe((attendances) => {
                console.log('📥 Received attendances:', attendances.length, 'items');
                
                let filteredAttendances = attendances;
                
                // If user is Preposto, filter attendances to only show users from their branch
                if (this.isPrepost && this.userLoggedInBranchId) {
                    console.log('🔍 Filtering attendances for Preposto - branchId:', this.userLoggedInBranchId);
                    filteredAttendances = attendances.filter(attendance => {
                        const userBranchId = attendance?.user?.branchId;
                        return userBranchId === this.userLoggedInBranchId;
                    });
                    console.log('✅ Filtered attendances:', filteredAttendances.length, 'items');
                } else if (!this.isPrepost) {
                    console.log('📋 Non-Preposto: showing all attendances');
                }
                
                this.attendances = filteredAttendances.map((attendance) => {
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
