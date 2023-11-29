//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';

//PrimeNg
import { MenuItem } from 'primeng/api';

//Models
import { Product } from '../../models/product';

//Services
import { ProductService } from '../../services/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { UserService } from 'src/app/services/user.service';

//Store
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';

//Libraies
import * as moment from 'moment';

//Utils
import Formatter from 'src/app/utils/formatters';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    //Chart
    barDataAttendances: any;
    barOptionsAttendances: any;

    //Language
    locale: string;

    //Utils
    formatter!: Formatter;

    //Store
    subscription: Subscription;
    companyState$: Observable<CompanyState>;

    //Variables
    usersNumber: any;
    vehiclesNumber: any;
    attendances: {
        arrayCountCheck: any[];
        arrayCountMissing: any[];
        arrayDates: any[];
    };
    selectedCompany: any;
    idCompany: any;

    constructor(
        public layoutService: LayoutService,
        public translateService: TranslateService,
        public attendaceService: AttendanceService,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        //Init
        this.formatter = new Formatter();
        this.companyState$ = store.select('companyState');
    }
    ngOnInit(): void {
        const companyServiceSubscription = this.companyState$.subscribe(
            (company) => {
                this.selectedCompany = company?.currentCompany;
                this.loadServices(this.selectedCompany);
            },
        );
        const translateServiceSubscription =
            this.translateService.onLangChange.subscribe(
                (langChangeEvent: LangChangeEvent) => {
                    this.locale = langChangeEvent.lang;
                    moment.locale(this.locale);
                    this.loadServices(this.selectedCompany);
                },
            );
        const layourServixeSubscription =
            this.layoutService.configUpdate$.subscribe(() => {
                this.loadServices(this.selectedCompany);
            });
        if (this.subscription) {
            this.subscription.add(companyServiceSubscription);

            this.subscription.add(layourServixeSubscription);

            this.subscription.add(translateServiceSubscription);
        }
    }

    loadServices(currentCompany) {
        this.attendaceService
            .getDataAttendances(currentCompany?.id | 0)
            .subscribe((data) => {
                this.attendances = this.formatter.formatCheckins(
                    data,
                    this.locale,
                );

                this.usersNumber = data.usersNumber;
                this.vehiclesNumber = data.vehiclesNumber;

                const documentStyle = getComputedStyle(
                    document.documentElement,
                );
                this.barDataAttendances = {
                    labels: this.attendances?.arrayDates,
                    datasets: [
                        {
                            label: 'CheckIn Done',
                            backgroundColor:
                                documentStyle.getPropertyValue('--green-500'),
                            borderColor:
                                documentStyle.getPropertyValue('--green-500'),
                            data: this.attendances?.arrayCountCheck,
                        },
                        {
                            label: 'Missing',
                            backgroundColor:
                                documentStyle.getPropertyValue('--red-500'),
                            borderColor:
                                documentStyle.getPropertyValue('--red-500'),
                            data: this.attendances?.arrayCountMissing,
                        },
                    ],
                };
            });
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
