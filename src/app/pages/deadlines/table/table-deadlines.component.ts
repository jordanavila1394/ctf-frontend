import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DeadlinesService } from 'src/app/services/deadlines.service';
import * as moment from 'moment';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
    templateUrl: './table-deadlines.component.html',
    styleUrls: ['./table-deadlines.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TableDeadlinesComponent implements OnInit {
    entities: any[];
    monthlySummary: any;
    expandedRows: number[] = [];
    currentMonth: string;
    selectedYear: number;
    selectedMonths: string[] = [];
    selectAllMonths: boolean = false;
    selectedCompany: any;
    years: number[];
    companyState$: Observable<CompanyState>;
    subscription: Subscription = new Subscription();
    months: { name: string; id: number }[]; // Dichiarazione di months come un array di oggetti con proprietà 'nome' e 'id'
    statusOptions: string[] = ['Pagato', 'Non pagato']; // Aggiungi altri stati se necessario

    constructor(
        private deadlinesService: DeadlinesService,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        this.companyState$ = store.select('companyState');
    }

    ngOnInit(): void {
        moment.locale('it');
        this.months = this.generateMonthObjects(); // Inizializzazione di months con i nomi dei mesi e i loro ID
        this.currentMonth = moment().format('MMMM');
        this.selectedYear = moment().year();
        this.years = this.getLastFiveYears();

        // Seleziona automaticamente il mese corrente
        const currentMonthObject = this.months.find(
            (month) => month.name === this.currentMonth,
        );
        if (currentMonthObject) {
            this.toggleMonthSelection(currentMonthObject);
        }
        const companyServiceSubscription = this.companyState$.subscribe(
            (company) => {
                this.selectedCompany = company?.currentCompany?.id;
                this.loadServices(this.selectedCompany);
            },
        );

        this.subscription.add(companyServiceSubscription);
    }

    loadServices(selectedCompany) {
        this.deadlinesService
            .allDeadlines(
                selectedCompany,
                this.selectedYear,
                this.selectedMonths,
            )
            .subscribe(
                (response) => {
                    this.entities = response.map((entity) => {
                        // Per ogni entità nel response
                        entity.deadlines = entity.deadlines
                            .sort((a, b) => a.loanNumber - b.loanNumber)
                            .map((deadline) => {
                                // Aggiungi il campo diffDays alla scadenza
                                return {
                                    ...deadline,
                                    diffDaysStyle:
                                        this.calculateDaysRemainingOrPassedClass(
                                            deadline,
                                        ),
                                    diffDays:
                                        this.calculateDaysRemainingOrPassed(
                                            deadline,
                                        ),
                                };
                            });
                        return entity;
                    });
                    this.expandedRows = this.entities.map((_, index) => index);
                },
                (error) => {
                    console.error('Upload failed', error);
                },
            );
        this.deadlinesService
            .monthlySummary(
                selectedCompany,
                this.selectedYear,
                this.selectedMonths,
            )
            .subscribe(
                (response) => {
                    this.months = response
                        .sort((a, b) => a.id - b.id)
                        .map((month) => {
                            // Mappa ogni elemento per aggiungere il nome del mese
                            return {
                                id: month.id,
                                name: moment().month(month.id).format('MMMM'), // Ottieni il nome del mese corrispondente all'ID
                                totalImportToPay: month.totalImportToPay,
                                missingImportToPay: month.missingImportToPay,
                                importPayed: month.importPayed,
                                importPayedPerc: month.importPayedPerc,
                            };
                        });
                },
                (error) => {
                    console.error('Upload failed', error);
                },
            );
    }
    onStatusChange(entity: any, deadline: any): void {
        // Puoi implementare la logica qui per gestire il cambio di stato
        console.log(
            `Stato della scadenza ${deadline.loanNumber} cambiato in: ${deadline.status}`,
        );
    }
    generateMonthObjects(): { name: string; id: number }[] {
        const momentMonths = moment.months(); // Ottieni i nomi dei mesi usando moment.js
        const monthsWithIds = momentMonths.map((monthName, index) => {
            return { name: monthName, id: index }; // Genera oggetti con il nome del mese e il suo ID numerico
        });
        return monthsWithIds;
    }

    calculateDaysRemainingOrPassedClass(deadline): string {
        const today = moment();
        const expiration = moment(deadline.expireDate, 'YYYY-MM-DD');
        const diffDays = expiration.diff(today, 'days');
        if (deadline.status === 'Pagato') return '';
        return diffDays <= 0 ? 'danger' : 'warning';
    }

    calculateDaysRemainingOrPassed(deadline): any {
        const today = moment();
        const expiration = moment(deadline.expireDate, 'YYYY-MM-DD');
        const diffDays = expiration.diff(today, 'days');
        if (deadline.status === 'Pagato') return '';
        return diffDays;
    }

    onSelectAllMonths(): void {
        if (this.selectAllMonths) {
            // If "Select All" checkbox is checked, select all months
            this.selectedMonths = this.months.map((month) =>
                month.id.toString(),
            );
        } else {
            // If "Select All" checkbox is unchecked, deselect all months
            this.selectedMonths = [];
        }
        this.loadServices(this.selectedCompany);
    }

    toggleMonthSelection(month): void {
        const monthNumber = month.id; // Ora puoi ottenere l'ID del mese direttamente dall'oggetto mese
        const index = this.selectedMonths.indexOf(monthNumber.toString());
        if (index === -1) {
            this.selectedMonths.push(monthNumber.toString());
        } else {
            this.selectedMonths.splice(index, 1);
        }
        this.loadServices(this.selectedCompany);
    }

    isMonthSelected(month): boolean {
        return this.selectedMonths.includes(month?.id.toString());
    }

    toggleExpand(index: number): void {
        if (this.isExpanded(index)) {
            this.expandedRows = this.expandedRows.filter(
                (row) => row !== index,
            );
        } else {
            this.expandedRows.push(index);
        }
    }

    isExpanded(index: number): boolean {
        return this.expandedRows.includes(index);
    }

    getLastFiveYears(): number[] {
        const currentYear = moment().year();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    }

    onYearChange(year: number): void {
        this.selectedYear = year;
        this.loadServices(this.selectedCompany);
    }
}
