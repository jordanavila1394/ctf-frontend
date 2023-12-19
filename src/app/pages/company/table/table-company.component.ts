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
import {
    MessageService,
    ConfirmationService,
    ConfirmEventType,
    MenuItem,
} from 'primeng/api';
import { CompanyService } from 'src/app/services/company.service';

import { Company } from 'src/app/models/company';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { ROUTES } from 'src/app/utils/constants';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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

    items: MenuItem[] | undefined;

    sizes!: any[];

    selectedSize: any = '';
    selectedItem: any = null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        public translateService: TranslateService,
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
        this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Dettagli',
                        icon: 'pi pi-search',
                        command: () => {
                            this.goToDetailCompany(this.selectedItem.id);
                        },
                    },
                    {
                        label: 'Modifica',
                        icon: 'pi pi-pencil',
                        command: () => {
                            this.goToModifyCompany(this.selectedItem.id);
                        },
                    },
                    {
                        label: 'Sedi',
                        icon: 'pi pi-pencil',
                        command: () => {
                            this.goToPlacesCompany(this.selectedItem);
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
            this.companies = companies.map((company) => {
                let newCompany = company;
                const ceo = company?.users?.find((x) => x.id === company.ceoId);
                if (ceo?.name && ceo?.surname) {
                    newCompany.fullName = ceo?.name + ' ' + ceo?.surname;
                } else {
                    newCompany.fullName = '';
                }
                return newCompany;
            });

            this.loading = false;
        });

        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceos = ceos;
        });
    }

    confirmErase(idCompany) {
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
                this.companyService
                    .deleteCompany(idCompany)
                    .subscribe((res) => this.loadServices());
            },
            reject: (type) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
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

    goToPlacesCompany(company) {
        this.router.navigate([ROUTES.ROUTE_PLACES_COMPANY], {
            queryParams: { id: company.id, name: company.name },
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
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
    //Actions
}
