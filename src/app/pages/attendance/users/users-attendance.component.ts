//Angular
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

//Libraries
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

//PrimeNg
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';

//Services
import { CompanyService } from 'src/app/services/company.service';

//Models
import { Company } from 'src/app/models/company';

//Utils
import { ROUTES } from 'src/app/utils/constants';
import Formatter from 'src/app/utils/formatters';

//Store
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder } from '@angular/forms';

//Libraries
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { ImagesDialogComponent } from 'src/app/shared/components/imagesDialog/images-dialog.component';
import { AttendanceService } from 'src/app/services/attendance.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './users-attendance.component.html',
    styleUrls: ['./users-attendance.component.scss'],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class UsersAttendanceComponent implements OnInit, OnDestroy {
    users: any;
    usersAttendaceSummary: any;
    rowGroupMetadata: any;

    loading: boolean = true;

    actionsFrozen: boolean = true;

    idCompany: any;
    companyState$: Observable<CompanyState>;
    selectedCompany: any;
    subscription: Subscription = new Subscription();

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    selectedCurrentMonth: any;
    selectedItem: any;
    monthsItems = [];

    imageList: string[] = [];

    //Utils
    formatter!: Formatter;

    usersAttendancesForm = this.fb.group({
        currentYear: [''],
        currentMonth: [''],
    });

    @ViewChild('filter') filter!: ElementRef;
    visible: boolean;

    items: MenuItem[] = [];

    constructor(
        private router: Router,
        public fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private attendanceService: AttendanceService,
        public dialogService: DialogService,
        private userService: UserService,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        this.companyState$ = store.select('companyState');
        this.formatter = new Formatter();
    }

    ngOnInit(): void {
        this.items = [
            {
                label: 'Presente',
                icon: 'pi pi-check',
                command: () => {
                    this.onStatusChange(this.selectedItem, 'Presente');
                },
            },
            {
                label: 'Verificare',
                icon: 'pi pi-times',
                command: () => {
                    this.onStatusChange(this.selectedItem, 'Verificare');
                },
            },
            {
                label: 'Malattia',
                command: () => {
                    this.onStatusChange(this.selectedItem, 'Malattia');
                },
            },
            {
                label: 'Ferie',
                command: () => {
                    this.onStatusChange(this.selectedItem, 'Ferie');
                },
            },
            {
                label: 'Permesso/ROL',
                command: () => {
                    this.onStatusChange(this.selectedItem, 'Permesso/ROL');
                },
            }
            ,
            {
                label: 'Sciopero',
                command: () => {
                    this.onStatusChange(this.selectedItem, 'Sciopero');
                },
            },
            {
                label: 'Non lavorato',
                command: () => {
                    this.onStatusChange(this.selectedItem, 'Non lavorato');
                },
            }
        ];

        //Current year
        moment.locale('it');

        this.usersAttendancesForm.patchValue({
            currentYear: moment().year() + '',
        });

        this.selectedCurrentMonth = {
            name: moment().format('MMMM'),
            code: moment().month(),
        };

        // Initialize monthsItems with all months of the year
        for (let i = 0; i < 12; i++) {
            this.monthsItems.push({
                name: moment().month(i).format('MMMM'),
                code: i,
            });
        }

        this.selectedCurrentMonth = this.monthsItems[moment().month()];


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

    onChangeMonth(event) {
        this.loadServices(this.selectedCompany);
    }

    //Services
    loadServices(selectedCompany) {
        const currentYear =
            parseInt(this.usersAttendancesForm.value.currentYear, 10) || '';
        const currentMonth = this.selectedCurrentMonth?.code || 0;

        const userServiceSubscription = this.userService
            .getAllUsersWithAttendances(
                selectedCompany.id,
                currentYear,
                currentMonth,
            )
            .subscribe((users) => {
                this.users = users.map((user) => ({
                    ...user,

                    company: user.companies[0]?.name,
                    createdAt: new Date(user.createdAt),

                    attendances: user.attendances.map((attendance) => ({
                        ...attendance,
                        workedHours: attendance?.checkOut
                            ? this.formatter.formatDifferenceHours(
                                new Date(attendance?.checkOut),
                                new Date(attendance?.checkIn),
                            )
                            : 0,
                        workedAccurateHours: attendance?.checkOut
                            ? this.formatter.formatDifferenceAccurateHours(
                                new Date(attendance?.checkOut),
                                new Date(attendance?.checkIn),
                            )
                            : 0,
                        checkIsWeekend: this.formatter.formatIsWeekendOrFestivo(
                            new Date(attendance?.checkIn),
                        ),
                    })),
                    totalHours: this.formatter.formatTotalWorkedHours(
                        user?.attendances,
                    ),
                }));
            });
        const userServiceAttendanceSummarySubscription = this.attendanceService
            .getUserAttendanceSummaryByMonth(
                selectedCompany.id,
                currentYear,
                currentMonth,
            )
            .subscribe((users) => {
                this.usersAttendaceSummary = users.map((user) => ({
                    ...user,
                }));
            });
        if (this.subscription && userServiceSubscription)
            this.subscription.add(userServiceSubscription);
        if (this.subscription && userServiceAttendanceSummarySubscription)
            this.subscription.add(userServiceAttendanceSummarySubscription);
    }

    //Validate
    validateAttendance(attendance) {
        this.attendanceService
            .validateAttendance(attendance?.id, attendance?.userId)
            .subscribe((res) => {
                this.loadServices(this.selectedCompany);
            });
    }

    unvalidateAttendance(attendance) {
        this.attendanceService
            .unvalidateAttendance(attendance?.id, attendance?.userId)
            .subscribe((res) => {
                this.loadServices(this.selectedCompany);
            });
    }

    getButtonStyle(status: string): string {
        switch (status.trim()) {
            case 'Presente':
                return 'p-button-success';
            case 'Verificare':
                return 'p-button-warning';
            case 'CheckOut?':
                return 'p-button-danger';
            default:
                return '';
        }
    }

    onStatusChange(attendance, status) {
        this.attendanceService
            .changeStatusAttendance(attendance?.id, status)
            .subscribe((res) => {
                this.loadServices(this.selectedCompany);
            });
    }

    //Excel
    exportExcelVertical() {
        import('xlsx').then((xlsx) => {
            const users = this.users;
            let objExcel = {};
            let arrayHeaders = [];
            for (let user of users) {
                let fullName = this.formatter.formatFullNameExcelSheet(
                    user.name,
                    user.surname,
                );
                let formattedAttendances =
                    this.formatter.formatAttendancesExcelSheet(
                        user.attendances,
                    );
                objExcel[fullName] =
                    xlsx.utils.json_to_sheet(formattedAttendances);
                arrayHeaders.push(fullName);
            }
            let workbook = {
                Sheets: objExcel,
                SheetNames: arrayHeaders,
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelVerticalFile(excelBuffer, 'utenze');
        });
    }

    saveAsExcelVerticalFile(buffer: any, fileName: string): void {
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

    exportExcelHorizontal() {
        import('xlsx').then((xlsx) => {
            const usersSummary = this.usersAttendaceSummary.map(
                (attendance) => {
                    return {
                        name: attendance.name,
                        surname: attendance.surname,
                        fiscalCode: attendance.fiscalCode,
                        attendanceCount: attendance.attendanceCount,
                        ...attendance,
                    };
                },
            );

            const worksheet = xlsx.utils.json_to_sheet(usersSummary);

            // Aggiungi stili alle prime tre colonne
            const range = xlsx.utils.decode_range(worksheet['!ref']);
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= 2; ++C) {
                    // Applica stile alle prime tre colonne
                    const cell_address = { c: C, r: R };
                    const cell_ref = xlsx.utils.encode_cell(cell_address);
                    const cell = worksheet[cell_ref];

                    if (!cell || !cell.s) cell.s = {}; // Assicurati che la cella abbia un oggetto stili
                    cell.s.fill = { fgColor: { rgb: 'FFFF00' } }; // Imposta il colore di sfondo a giallo
                }
            }

            const workbook = {
                Sheets: { Presenze: worksheet },
                SheetNames: ['Presenze'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelHorizontalFile(excelBuffer, 'presenzeOrizzontale');
        });
    }

    saveAsExcelHorizontalFile(buffer: any, fileName: string): void {
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

    //Dialog
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

    goToModifyAttendance(idCompany) {
        this.router.navigate([ROUTES.ROUTE_MODIFY_ATTENDANCE], {
            queryParams: { id: idCompany },
        });
    }

    goToDetailAttendance(idCompany) {
        this.router.navigate([ROUTES.ROUTE_DETAIL_ATTENDANCE], {
            queryParams: { id: idCompany },
        });
    }

    //DIALOG
    showImages(attendanceImages) {
        const ref = this.dialogService.open(ImagesDialogComponent, {
            header: 'Foto',
            width: '90%',
            data: attendanceImages,
        });
    }

    //Table
    expandAll() {
        if (!this.isExpanded) {
            this.users.forEach((product) =>
                product && product.name
                    ? (this.expandedRows[product.name] = true)
                    : '',
            );
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
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

    synchronizeAttendances() {
        const currentYear = parseInt(this.usersAttendancesForm.value.currentYear, 10) || moment().year();
        const currentMonth = this.selectedCurrentMonth?.code || moment().month();

        this.users = this.users.map((user) =>
            this.attendanceService
                .synchronizeAttendances(user.id, this.selectedCompany.id, currentMonth, currentYear)
                .subscribe((res) => {
                })
        );
        this.loadServices(this.selectedCompany);
    }
}
