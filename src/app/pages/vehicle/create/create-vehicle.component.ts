import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { BlobOptions } from 'buffer';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
    templateUrl: './create-vehicle.component.html',
    providers: [MessageService, ConfirmationService],
})
export class CreateVehicleComponent implements OnInit {
    selectedLegalForm: any = null;
    selectedCeo: any = null;

    legalFormItems = [
        {
            name: 'Società a responsabilità limitata',
            id: 'Società a responsabilità limitata',
        },
        {
            name: 'Società per azioni',
            id: 'Società per azioni',
        },
    ];

    ceosItems: any;
    checkedStatus: boolean = true;

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private vehicleService: VehicleService,
        private companyService: CompanyService,
    ) {
        this.ngxGpAutocompleteService.setOptions({
            componentRestrictions: { country: ['IT'] },
            types: ['geocode'],
        });
    }

    ngOnInit() {
        this.loadServices();
    }

    loadServices() {
        // this.userService.getAllCeos().subscribe((ceos) => {
        //     this.ceosItems = ceos.map((ceo) => ({
        //         ...ceo,
        //         fullName: ceo.name + ' ' + ceo.surname,
        //     }));
        // });
    }

    createForm = this.fb.group({
        licensePlate: ['', [Validators.required]],
        tipology: [''],
        model: [''],
        rentalType: [''],
        driverType: [''],
    });

    onSubmit(): void {
        this.vehicleService
            .createVehicle(
                this.createForm.value.licensePlate,
                this.createForm.value.tipology,
                this.createForm.value.model,
                this.createForm.value.rentalType,
                this.createForm.value.driverType,
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_TABLE_VEHICLE]),
            );
    }
}
