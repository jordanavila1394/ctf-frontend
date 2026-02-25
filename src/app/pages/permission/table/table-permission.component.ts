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
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';

//Services
import { CompanyService } from 'src/app/services/company.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

//Models
import { Company } from 'src/app/models/company';

//Utils
import { ROUTES } from 'src/app/utils/constants';
import { EmailService } from 'src/app/services/email.service';
import Formatter from 'src/app/utils/formatters';

//Store
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import * as FileSaver from 'file-saver';

@Component({
    templateUrl: './table-permission.component.html',
    styleUrls: ['./table-permission.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TablePermissionComponent implements OnInit, OnDestroy {
    attendances: Company[] = [];

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

    permissions: any;

    formatter!: Formatter;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private permissionService: PermissionService,
        private userService: UserService,
        private authService: AuthService,
        public emailService: EmailService,
        private store: Store<any>,
    ) {
        this.companyState$ = store.select('companyState');
        this.formatter = new Formatter();
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

    loadServices(currentCompany) {
        const permissionServiceSubscription = this.permissionService
            .allPermissionsByMonth(currentCompany.id | 0)
            .subscribe((groupedPermissions: { [month: string]: any[] }) => {

                console.log('📥 Received permissions:', Object.values(groupedPermissions).flat().length, 'items');

                let filteredGroupedPermissions = groupedPermissions;

                // If user is Preposto, filter permissions to only show users from their branch
                if (this.isPrepost && this.userLoggedInBranchId) {
                    console.log('🔍 Filtering permissions for Preposto - branchId:', this.userLoggedInBranchId);
                    filteredGroupedPermissions = {};
                    
                    Object.entries(groupedPermissions).forEach(([month, permissions]) => {
                        const filteredPermissions = permissions.filter(permission => {
                            const userBranchId = permission?.user?.branchId;
                            console.log('   User:', permission?.user?.name, 'branchId:', userBranchId, 'match:', userBranchId === this.userLoggedInBranchId);
                            return userBranchId === this.userLoggedInBranchId;
                        });
                        if (filteredPermissions.length > 0) {
                            filteredGroupedPermissions[month] = filteredPermissions;
                        }
                    });
                    console.log('✅ Filtered permissions count:', Object.values(filteredGroupedPermissions).flat().length, 'items');
                } else if (!this.isPrepost) {
                    console.log('📋 Non-Preposto: showing all permissions');
                }

                this.permissions = Object.entries(filteredGroupedPermissions).map(([month, permissions]) => ({
                    month,
                    permissions: permissions.map((permission) => ({
                        ...permission,
                        utente:
                            permission?.user?.name +
                            ' ' +
                            permission?.user?.surname,
                        codicefiscale: permission?.user?.fiscalCode,
                        datesText: permission?.dates,
                        dates: permission?.dates?.split(','),
                    })),
                }));
                console.log(this.permissions)

                this.loading = false;
            });

        if (this.subscription && permissionServiceSubscription) {
            this.subscription.add(permissionServiceSubscription);
        }
    }

    getMonths(): string[] {
        return this.permissions ? Object.keys(this.permissions) : [];
    }


    approvePermission(permission) {
        this.permissionService
            .approvePermission(permission?.id, permission?.user?.id)
            .subscribe((res) => {
                if (permission?.user?.email) {
                    let messageEmail = '';
                    messageEmail +=
                        'Ciao, ' +
                        permission?.user?.name +
                        ' ' +
                        permission?.user?.surname +
                        '. <br>';
                    messageEmail += "E' stato approvata la sua richiesta: <br>";
                    messageEmail +=
                        '<strong>' + permission?.datesText + '</strong><br>';

                    this.emailService
                        .sendEmail(
                            permission?.user?.email,
                            'CTF - Permesso approvato - ' + permission?.id,
                            messageEmail,
                        )
                        .subscribe(
                            (risposta) =>
                                console.log(
                                    'Email inviata con successo:',
                                    risposta,
                                ),
                            (errore) =>
                                console.error(
                                    "Errore durante l'invio dell'email:",
                                    errore,
                                ),
                        );
                }

                this.loadServices(this.selectedCompany);
            });
    }

    rejectPermission(permission) {
        this.permissionService
            .rejectPermission(permission?.id, permission?.user?.id)
            .subscribe((res) => {
                if (permission?.user?.email) {
                    this.emailService
                        .sendEmail(
                            permission?.user?.email,
                            'CTF - Permesso Negato - ' + permission?.id,
                            "E' stato negato il suo permesso",
                        )
                        .subscribe(
                            (risposta) =>
                                console.log(
                                    'Email inviata con successo:',
                                    risposta,
                                ),
                            (errore) =>
                                console.error(
                                    "Errore durante l'invio dell'email:",
                                    errore,
                                ),
                        );
                }
                this.loadServices(this.selectedCompany);
            });
    }
    //Excel
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.permissions);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'permessi');
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
