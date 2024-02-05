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

import { Company } from 'src/app/models/company';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import * as FileSaver from 'file-saver';

import { ROUTES } from 'src/app/utils/constants';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicle.service';
//Store
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
    templateUrl: './table-vehicle.component.html',
    styleUrls: ['./table-vehicle.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TableVehicleComponent implements OnInit {
    vehicles: any[] = [];

    selectedVehicle: any[] = [];

    rowGroupMetadata: any;

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

    display: boolean;

    actionsFrozen: boolean = true;

    items: MenuItem[] | undefined;

    sizes!: any[];

    selectedSize: any = '';

    @ViewChild('filter') filter!: ElementRef;

    idCompany: any;
    companyState$: Observable<CompanyState>;
    selectedCompany: any;
    subscription: Subscription = new Subscription();

    constructor(
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private vehicleService: VehicleService,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        this.companyState$ = store.select('companyState');
    }

    selectAddress(place: any): void {}

    ngOnInit() {
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
        const vehicleServiceSubscription = this.vehicleService
            .getAllVehicles(selectedCompany.id)
            .subscribe((vehicles) => {
                this.vehicles = vehicles.map((vehicle) => {
                    return vehicle;
                });
                this.loading = false;
            });
        if (vehicleServiceSubscription)
            this.subscription.add(vehicleServiceSubscription);
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

    // expandAll() {
    //     if (!this.isExpanded) {
    //         this.products.forEach((product) =>
    //             product && product.name
    //                 ? (this.expandedRows[product.name] = true)
    //                 : ''
    //         );
    //     } else {
    //         this.expandedRows = {};
    //     }
    //     this.isExpanded = !this.isExpanded;
    // }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
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
    //Export file

    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.vehicles);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'mezzi-vehicles');
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
    //Actions
}
