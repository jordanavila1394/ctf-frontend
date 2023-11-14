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
import { CompanyService } from 'src/app/services/company.service';
import { PrimeNGConfig } from 'primeng/api';

import { Company } from 'src/app/models/company';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { ROUTES } from 'src/app/utils/constants';
import { Router } from '@angular/router';
interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './table-company.component.html',
    styleUrls: ['./table-company.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TableCompanyComponent implements OnInit {
    companies: Company[] = [];

    ceos: User[] = [];

    selectedCompanies1: Company[] = [];

    selectedCompany: Company = {};

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

    @ViewChild('filter') filter!: ElementRef;

    statuses = [
        { label: 'Unqualified', value: 'unqualified' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'New', value: 'new' },
        { label: 'Negotiation', value: 'negotiation' },
        { label: 'Renewal', value: 'renewal' },
        { label: 'Proposal', value: 'proposal' },
    ];
    menuItems = [
        {
            label: 'Save',
            icon: 'pi pi-fw pi-check',
        },
        {
            label: 'Update',
            icon: 'pi pi-fw pi-refresh',
        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
        },
        {
            separator: true,
        },
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
        },
    ];
    constructor(
        private config: PrimeNGConfig,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private userService: UserService
    ) {
        this.ngxGpAutocompleteService.setOptions({
            componentRestrictions: { country: ['IT'] },
            types: ['geocode'],
        });
    }

    selectAddress(place: any): void {}

    ngOnInit() {
        this.config.setTranslation({
            matchAll: 'Confronta tutto',
            matchAny: 'Confronta qualsiasi',
            startsWith: 'Inizia con',
            contains: 'Contiene',
            notContains: 'Non contiene',
            endsWith: 'Finisce in',
            equals: 'Uguale',
            notEquals: 'Non uguale',
            noFilter: 'Senza filtro',
            lt: 'Minore di',
        });
        this.loadServices();
    }
    loadServices() {
        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies.map((company) => ({
                ...company,
                fullName: company.user.name + ' ' + company.user.surname,
            }));
            this.loading = false;
        });

        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceos = ceos;
        });
    }

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

    goToModifyCompany(idCompany) {
        this.router.navigate([ROUTES.ROUTE_MODIFY_COMPANY], {
            queryParams: { id: idCompany },
        });
    }

    goToDetailCompany(idCompany) {
        this.router.navigate([ROUTES.ROUTE_DETAIL_COMPANY], {
            queryParams: { id: idCompany },
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
}
