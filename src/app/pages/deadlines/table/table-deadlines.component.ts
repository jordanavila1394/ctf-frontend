import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DeadlinesService } from 'src/app/services/deadlines.service';
import * as moment from 'moment';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Dialog } from 'primeng/dialog';
import { CompanyService } from 'src/app/services/company.service';
import { FormBuilder, Validators } from '@angular/forms';
import { EntityService } from 'src/app/services/entity.service';

@Component({
    templateUrl: './table-deadlines.component.html',
    styleUrls: ['./table-deadlines.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class TableDeadlinesComponent implements OnInit {
    @ViewChild('importModal', { static: false }) importModal: Dialog; // Assuming Dialog is the correct type
    @ViewChild('entitiesModal', { static: false }) entitiesModal: Dialog; // Assuming Dialog is the correct type

    entities: any[];
    modalEntities: any[];
    monthlySummary: any;
    expandedRows: number[] = [];
    currentMonth: string;
    selectedYear: number;
    selectedMonths: string[] = [];
    selectAllMonths: boolean = false;
    selectedCompany: any;
    companies: [];
    years: number[];
    companyState$: Observable<CompanyState>;
    subscription: Subscription = new Subscription();
    months: { name: string; id: number }[]; // Dichiarazione di months come un array di oggetti con proprietà 'nome' e 'id'
    statusOptions: string[] = ['Pagato', 'Non pagato']; // Aggiungi altri stati se necessario

    editingIndex: number | null = null;
    editedPayer: string = '';

    /*TOTALS*/
    totalImportNotPayedSum;
    totalImportToPaySum;
    totalImportSum;
    createEntityForm;

    fileUploadExcel: File;

    rowsInsert;
    rowsUpdate;
    errorEntity;
    constructor(
        private deadlinesService: DeadlinesService,
        private companyService: CompanyService,
        private entityService: EntityService,
        private messageService: MessageService,
        public fb: FormBuilder,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        this.companyState$ = store.select('companyState');
        this.createEntityForm = this.fb.group({
            companyId: [null, Validators.required],
            name: ['', Validators.required],
            identifier: ['', Validators.required],
            payer: [''],
        });
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
        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies;
        });

        this.subscription.add(companyServiceSubscription);
    }

    loadServices(selectedCompany) {
        if (selectedCompany == null) {
            selectedCompany = 0;
        }
        const entityServiceSubscription = this.entityService
            .getAllEntities(selectedCompany)
            .subscribe((entities) => {
                this.modalEntities = entities;
            });
        if (this.subscription && entityServiceSubscription)
            this.subscription.add(entityServiceSubscription);

        this.deadlinesService
            .allDeadlines(
                selectedCompany,
                this.selectedYear,
                this.selectedMonths,
            )
            .subscribe(
                (response) => {
                    this.entities = response.entities.map((entity) => {
                        // Per ogni entità nel response
                        entity.deadlines = entity.deadlines
                            .sort(
                                (a, b) =>
                                    new Date(a.expireDate).getTime() -
                                    new Date(b.expireDate).getTime(),
                            ) // Converti le date in oggetti Date e poi sottrai i timestamp
                            // Modifica il sorting per la data di scadenza
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

                    this.totalImportNotPayedSum =
                        response.totalImportNotPayedSum;
                    this.totalImportToPaySum = response.totalImportToPaySum;
                    this.totalImportSum = response.totalImportSum;
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
    openImportModal(): void {
        this.importModal.visible = true;
    }

    closeImportModal(): void {
        this.importModal.visible = false;
    }
    openEntitiesModal(): void {
        this.entitiesModal.visible = true;
    }

    closeEntitiesModal(): void {
        this.entitiesModal.visible = false;
    }

    // onDialogHide() {
    //     this.fileUploadExcel = null; // Reset fileUploadExcel
    //     const fileInput = document.getElementById(
    //         'fileInput',
    //     ) as HTMLInputElement;
    //     if (fileInput) {
    //         fileInput.value = '';
    //     }
    //     this.rowsInsert = null;
    //     this.rowsUpdate = null;
    // }

    addEntity(): void {

        if (this.createEntityForm.valid) {
            this.entityService
                .createEntity(
                    this.createEntityForm.value.companyId,
                    this.createEntityForm.value.name,
                    this.createEntityForm.value.identifier,
                    this.createEntityForm.value.payer,
                )
                .subscribe((res) => {
                    this.loadServices(this.selectedCompany);
                });
        }
        
    }

    onFileSelected(event: any): void {
        // Ensure that files were selected
        if (event.target.files.length > 0) {
            this.fileUploadExcel = event.target.files[0] as File;
            console.log('File selected:', this.fileUploadExcel);
        } else {
            console.error('No file selected.');
        }
    }
    downloadSampleXlsx(): void {
        // Crea un URL per il tuo file XLSX di esempio
        const sampleXlsxUrl = 'assets/xlsx/template.xlsx';

        // Crea un link temporaneo per il download del file
        const link = document.createElement('a');
        link.href = sampleXlsxUrl;
        link.download = 'template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    uploadExcelToBackend(): void {
        // Assuming you have a service method in DeadlinesService to handle CSV upload
        if (!this.fileUploadExcel) {
            console.error('No file selected.');
            return;
        }
        this.deadlinesService
            .uploadDeadlinesExcel(this.fileUploadExcel)
            .subscribe(
                (response) => {
                    // Handle success response
                    const { rowsInsert, rowsUpdate, entityNotExist } = response;
                    // Refresh data or do anything else as needed
                    this.rowsInsert = rowsInsert;
                    this.rowsUpdate = rowsUpdate;
                    this.errorEntity = entityNotExist;
                    this.loadServices(this.selectedCompany);
                },
                (error) => {
                    // Handle error response
                },
            );
    }

    onPaymentPaymentDateChange(paymentDate: string, deadline: any) {
        // Handle the change if necessary
        this.deadlinesService
            .changePaymentDateDeadline(deadline?.id, paymentDate)
            .subscribe((res) => {
                this.loadServices(this.selectedCompany);
            });
    }
    onPaymentExpireDateChange(newDate: string, deadline: any) {
        // Handle the change if necessary
    }

    deleteEntity(entityId: string) {
        this.entityService.deleteEntity(entityId).subscribe((res) => {
            this.loadServices(this.selectedCompany);
        });
    }

    onStatusChange(entity: any, deadline: any): void {
        this.deadlinesService
            .changeStatusDeadline(deadline?.id, deadline?.status)
            .subscribe((res) => {
                this.loadServices(this.selectedCompany);
            });
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

    toggleEditPayer(index: number): void {
      
        if (this.editingIndex === null || this.editingIndex !== index) {
            this.editingIndex = index;
            this.editedPayer = this.entities[index].payer; // Pre-carica il valore corrente
        }
    }

    savePayer(event: Event, index: number): void {
        event.stopPropagation();
        this.entities[index].payer = this.editedPayer;
        this.entityService.updatePayerEntity(this.entities[index].id, {
            payer: this.editedPayer
        }).subscribe(
            (res) => {
                console.log('Entity updated successfully', res);
                this.loadServices(this.selectedCompany);
            },
            (error) => {
                console.error('Error updating entity', error);
            }
        );

        this.editingIndex = null; // Esci dalla modalità di modifica

    }

    cancelEdit(event: Event): void {
        event.stopPropagation();
        this.editingIndex = null; // Annulla la modifica
    }

    isExpanded(index: number): boolean {
        return this.expandedRows.includes(index);
    }

    getLastFiveYears(): number[] {
        const currentYear = moment().year();
        const years = [];
        const yearPlusFive = currentYear + 5;
        for (let i = 0; i < 10; i++) {
            years.push(yearPlusFive - i);
        }
        return years;
    }

    onYearChange(year: number): void {
        this.selectedYear = year;
        this.loadServices(this.selectedCompany);
    }
}
