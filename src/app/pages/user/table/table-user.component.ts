import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { Representative } from '../../../models/customer';
import { Product } from '../../../models/product';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { ROUTES } from 'src/app/utils/constants';
import { Router } from '@angular/router';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CompanyService } from 'src/app/services/company.service';
import { RoleService } from 'src/app/services/role.service';

import * as FileSaver from 'file-saver';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './table-user.component.html',
    styleUrls: ['./table-user.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TableUserComponent implements OnInit {
    users: User[] = [];

    selectedUsers1: User[] = [];

    selectedUser: User;

    representatives: Representative[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

    display: boolean;

    actionsFrozen: boolean = true;

    sizes!: any[];

    selectedSize: any = '';

    @ViewChild('filter') filter!: ElementRef;

    roles: any[];
    companies: any[];

    items: MenuItem[] | undefined;
    selectedItem: any = null;

    constructor(
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private confirmationService: ConfirmationService,
        public translateService: TranslateService,
        private messageService: MessageService,
        private userService: UserService,
        private companyService: CompanyService,
        private roleService: RoleService
    ) {
        this.ngxGpAutocompleteService.setOptions({
            componentRestrictions: { country: ['IT'] },
            types: ['geocode'],
        });
    }

    selectAddress(place: any): void {}

    ngOnInit() {
        this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Dettagli',
                        icon: 'pi pi-search',
                        command: () => {
                            this.goToDetailUser(this.selectedItem.id);
                        },
                    },
                    {
                        label: 'Modifica',
                        icon: 'pi pi-pencil',
                        command: () => {
                            this.goToModifyUser(this.selectedItem.id);
                        },
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-trash',
                        command: () => {
                            // this.delete();
                            this.confirmErase(this.selectedItem.id);
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

        this.loadServices();
    }

    loadServices() {
        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies;
        });

        this.userService.getAllUsers().subscribe((users) => {
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

        this.loading = false;
    }

    confirmErase(idUser) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confermato',
                    detail: 'Hai accettato',
                });
                this.userService
                    .deleteUser(idUser)
                    .subscribe((res) => this.loadServices());
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

    //Table methods

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach((product) =>
                product && product.name
                    ? (this.expandedRows[product.name] = true)
                    : ''
            );
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        console.log('event', event);
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
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
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
}
