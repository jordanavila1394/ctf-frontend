//Angular
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

//Models
import { Representative } from '../../../models/customer';
import { Product } from '../../../models/product';
import { User } from 'src/app/models/user';

//PrimeNg
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';

//Utils
import { ROUTES } from 'src/app/utils/constants';

//Services
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CompanyService } from 'src/app/services/company.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

//Libraries
import * as FileSaver from 'file-saver';

//Store
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
    templateUrl: './table-user.component.html',
    styleUrls: ['./table-user.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TableUserComponent implements OnInit, OnDestroy {
    users: User[] = [];

    rowGroupMetadata: any;

    loading: boolean = true;

    actionsFrozen: boolean = true;

    sizes!: any[];

    selectedSize: any = '';

    @ViewChild('filter') filter!: ElementRef;

    items: MenuItem[] | undefined;
    selectedUser: any = null;

    idCompany: any;
    companyState$: Observable<CompanyState>;
    selectedCompany: any;
    subscription: Subscription = new Subscription();

    constructor(
        private router: Router,
        public confirmationService: ConfirmationService,
        public translateService: TranslateService,
        private messageService: MessageService,
        private userService: UserService,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        this.companyState$ = store.select('companyState');
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Dettagli',
                        icon: 'pi pi-search',
                        command: () => {
                            this.goToDetailUser(this.selectedUser.id);
                        },
                    },
                    {
                        label: 'Documenti',
                        icon: 'pi pi-file',
                        command: () => {
                            this.goToDocumentUser(
                                this.selectedUser.id,
                                this.selectedUser.fiscalCode,
                            );
                        },
                    },
                    {
                        label: 'Modifica',
                        icon: 'pi pi-pencil',
                        command: () => {
                            this.goToModifyUser(this.selectedUser.id);
                        },
                    },
                    {
                        label: 'Elimina',
                        icon: 'pi pi-trash',
                        command: () => {
                            // this.delete();
                            this.confirmErase(this.selectedUser.id);
                        },
                    },
                ],
            },
        ];
        this.sizes = [
            {
                name: 'S',
                class: 'p-datatable-sm',
            },
            {
                name: 'M',
                class: '',
            },
            {
                name: 'L',
                class: 'p-datatable-lg',
            },
        ];

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

    loadServices(selectedCompany) {
        const userServiceSubscription = this.userService
            .getAllUsers(selectedCompany.id)
            .subscribe((users) => {
                this.users = users.map((user) => ({
                    ...user,
                    mainRole: {
                        name: user.roles[0]?.name,
                        label: user.roles[0]?.label,
                    },
                    role: user.roles[0]?.label,
                    company: user.companies[0]?.name,
                    createdAt: new Date(user.createdAt),
                }));
            });
        this.subscription.add(userServiceSubscription);

        this.loading = false;
    }

    confirmErase(idUser) {
        console.log("confirm erase")
        this.confirmationService.confirm({
            message: 'Vuoi eliminare questo utente?',
            header: 'Elimina conferma',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confermato',
                    detail: 'Hai accettato',
                });
                this.userService
                    .deleteUser(idUser)
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

    goToModifyUser(idUser) {
        this.router.navigate([ROUTES.ROUTE_MODIFY_USER], {
            queryParams: { id: idUser },
        });
    }

    goToDetailUser(idUser) {
        this.router.navigate([ROUTES.ROUTE_DETAIL_USER], {
            queryParams: { id: idUser },
        });
    }

    goToDocumentUser(idUser, fiscalCode) {
        this.router.navigate([ROUTES.ROUTE_DOCUMENTS_USER], {
            queryParams: { id: idUser, fiscalCode: fiscalCode },
        });
    }

    //Table methods

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
    isActionVisible(user) {
        let isVisible = true;
        if (
            user.mainRole.name === 'admin' ||
            user.mainRole.name === 'moderator'
        )
            return false;
        return isVisible;
    }
    //export
    //Export file

    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.users);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'utenti-users');
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
}
