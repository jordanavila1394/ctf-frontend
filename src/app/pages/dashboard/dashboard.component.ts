import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import * as moment from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { UserService } from 'src/app/services/user.service';
import Formatter from 'src/app/utils/formatters';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    barData: any;

    barOptions: any;

    locale: string;

    usersNumber: any;
    vehiclesNumber: any;

    formatter!: Formatter;
    attendances: {
        arrayCountCheck: any[];
        arrayCountMissing: any[];
        arrayDates: any[];
    };

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        public translateService: TranslateService,
        private userService: UserService,
        public attendaceService: AttendanceService,
    ) {
        this.formatter = new Formatter();
        this.locale = this.translateService.currentLang;
        moment.locale(this.locale);
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
        this.translateService.onLangChange.subscribe(
            (langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
                moment.locale(this.locale);
                this.initChart();
            },
        );
    }

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        this.attendaceService.getDataAttendances().subscribe((data) => {
            this.attendances = this.formatter.formatCheckins(data, this.locale);
            this.usersNumber = data.usersNumber;
            this.vehiclesNumber = data.vehiclesNumber;

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue(
                '--text-color-secondary',
            );
            const surfaceBorder =
                documentStyle.getPropertyValue('--surface-border');

            // CHECKIN E CHECKOUT

            this.barData = {
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
            this.barOptions = {
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500,
                            },
                        },
                        grid: {
                            display: false,
                            drawBorder: false,
                        },
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                },
            };

            this.chartData = {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                ],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        backgroundColor:
                            documentStyle.getPropertyValue('--bluegray-700'),
                        borderColor:
                            documentStyle.getPropertyValue('--bluegray-700'),
                        tension: 0.4,
                    },
                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        backgroundColor:
                            documentStyle.getPropertyValue('--green-600'),
                        borderColor:
                            documentStyle.getPropertyValue('--green-600'),
                        tension: 0.4,
                    },
                ],
            };

            this.chartOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                },
            };
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
