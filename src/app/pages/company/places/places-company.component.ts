import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
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

import { ROUTES } from 'src/app/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from 'src/app/services/place.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Place } from 'src/app/models/place';

interface Places {
    name: string;
}
interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './places-company.component.html',
    styleUrls: ['./places-company.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class PlacesCompanyComponent implements OnInit {
    places: [];

    ceos: User[] = [];

    selectedPlaces1: Company[] = [];

    selectedPlace: Company = {};

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

    @ViewChild('filter') filter!: ElementRef;

    hasPlaces$$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    idCompany: any;
    nameCompany: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private userService: UserService,
        public fb: FormBuilder,
        private placeService: PlaceService
    ) {
        this.ngxGpAutocompleteService.setOptions({
            componentRestrictions: { country: ['IT'] },
            types: ['geocode'],
        });
    }

    createForm = this.fb.group({
        address: ['', [Validators.required]],
        addressLat: [''],
        addressLong: [''],
        addressPlaceId: [''],
        addressUrl: [''],
        name: [''],
        description: [''],
        companyId: ['', [Validators.required]],
    });

    selectAddress(place: any): void {}

    ngOnInit() {
        this.loadServices();
    }

    loadServices() {
        this.route.queryParams.subscribe((params) => {
            this.idCompany = params['id'];
            this.nameCompany = params['name'];

            this.placeService
                .getPlacesByCompany(this.idCompany)
                .subscribe((places) => {
                    this.places = places;
                    let result: Place = places;
                    this.hasPlaces$$.next(result);
                    this.changeDetectorRef.detectChanges();
                });

            this.createForm.patchValue({
                companyId: this.idCompany,
            });
            this.loading = false;
        });
    }

    //Submit
    onSubmit(): void {
        this.placeService
            .createPlace(
                this.createForm.value.name,
                this.createForm.value.address,
                this.createForm.value.addressLat,
                this.createForm.value.addressLong,
                this.createForm.value.addressPlaceId,
                this.createForm.value.addressUrl,
                parseInt(this.createForm.value.companyId, 10),
                this.createForm.value.description
            )
            .subscribe(() => window.location.reload());
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
}
