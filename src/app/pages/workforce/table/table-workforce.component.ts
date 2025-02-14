import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

interface User {
    id: number;
    name: string;
    surname: any;
    absences: Absence[];
    attendances: any[];
}

interface Absence {
    date: string;
    type: AbsenceType;
}
interface Attendances {
    date: string;
    type: AbsenceType;
}

type AbsenceType = 'Malattia' | 'Ferie' | 'Permesso' | 'Permesso ROL';

@Component({
    selector: 'app-table-workforce',
    templateUrl: './table-workforce.component.html',
    styleUrls: ['./table-workforce.component.scss']
})
export class TableWorkforceComponent implements OnInit, OnDestroy {
    @ViewChild('centerPane') centerPaneRef: ElementRef | undefined;
    userId: number = 1; // ID dell'utente per il quale pulire i permessi

    allMonths: string[] = [];
    allDays: Date[] = [];
    currentYear: number = new Date().getFullYear();
    currentDate: Date = new Date();
    associatedClients: any[] = [];
    workForceForm: FormGroup;
    selectedClient: string | null = null;
    userPermissions: any;
    selectedMonth: number | null = null;
    selectedMonthLabel: string = '';
    selectedYear: any;
    years: { label: string, value: number }[] = [
        { label: `${this.currentYear}`, value: this.currentYear },
        { label: `${this.currentYear - 1}`, value: this.currentYear - 1 }
    ];
    months: { label: string, value: number }[] = [
        { label: 'Gennaio', value: 0 },
        { label: 'Febbraio', value: 1 },
        { label: 'Marzo', value: 2 },
        { label: 'Aprile', value: 3 },
        { label: 'Maggio', value: 4 },
        { label: 'Giugno', value: 5 },
        { label: 'Luglio', value: 6 },
        { label: 'Agosto', value: 7 },
        { label: 'Settembre', value: 8 },
        { label: 'Ottobre', value: 9 },
        { label: 'Novembre', value: 10 },
        { label: 'Dicembre', value: 11 }
    ];
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    isLoading: boolean;

    constructor(
        private userService: UserService,
        private permissionService: PermissionService,
        private cdRef: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.workForceForm = this.fb.group({
            associatedClient: [null, Validators.required],
            selectedMonth: [null, Validators.required],
            selectedYear: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.getAllAssociatedClients();

        // Set current year and month
        const currentMonth = new Date().getMonth(); // 0-based index (0 = January)
        const currentYear = new Date().getFullYear(); // Current year

        // Initialize the form with the current month and year
        this.workForceForm.patchValue({
            selectedMonth: currentMonth,
            selectedYear: currentYear
        });
        this.selectedMonth = currentMonth;
        this.selectedYear = currentYear;

        // Listen for changes to the selectedClient and fetch new permissions
        this.workForceForm.get('associatedClient')?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(selectedClient => {
                this.selectedClient = selectedClient;
                this.getAllPermissionsByClient();
            });

        // Listen for changes to the selectedMonth and update the days
        this.workForceForm.get('selectedMonth')?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(month => {
                console.log(month)
                this.selectedMonth = month;
                this.selectedMonthLabel = this.months.find(m => m.value === month)?.label || '';
                this.generateDaysForMonth(month);
                this.getAllPermissionsByClient();
            });

        // Listen for changes to the selectedYear and update the days
        this.workForceForm.get('selectedYear')?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(year => {
                console.log(year)
                this.selectedYear = year;
                this.generateDaysForMonth(this.selectedMonth);
                this.getAllPermissionsByClient();
            });

        // Initial load of permissions and day generation
        this.generateDaysForMonth(currentMonth);
        this.getAllPermissionsByClient();
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    getAllPermissionsByClient() {
        console.log(this.selectedMonth);
        console.log(this.selectedYear);

        // Ensure selectedMonth and selectedYear are not null
        if (this.selectedMonth !== null && this.selectedYear !== null) {
            this.isLoading = true; // Start loading

            // Adjust the startDate and endDate based on the selected month and year
            const startOfMonth = new Date(this.selectedYear, this.selectedMonth, 1);
            const endOfMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0);

            // Set the end of the month to the last moment (23:59:59.999)
            endOfMonth.setHours(23, 59, 59, 999);

            // Call the service to get permissions
            this.permissionService.getPermissionsByClient(
                this.selectedClient,
                startOfMonth,
                endOfMonth
            )
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                    next: (data) => {
                        this.userPermissions = data;
                        this.isLoading = false; // Stop loading
                    },
                    error: (error) => {
                        console.error('Error fetching permissions:', error);
                        this.isLoading = false; // Stop loading on error
                    }
                });
        } else {
            console.warn('Selected month or year is not set.');
        }
    }



    getAllAssociatedClients() {
        this.userService.getAllAssociatedClients()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                clients => this.associatedClients = clients,
                error => console.error('Error fetching associated clients:', error)
            );
    }

    // generateMonthsAndDays(selectedMonth: number) {
    //     this.allMonths = [];
    //     this.allDays = [];
    //     const startDate = new Date(this.workForceForm.get('startDate')?.value || new Date(this.currentYear, 0, 1));
    //     const endDate = new Date(this.workForceForm.get('endDate')?.value || new Date(this.currentYear, 11, 31));

    //     for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    //         this.allDays.push(new Date(d));
    //         if (d.getDate() === 1) {
    //             const monthName = d.toLocaleDateString('it-IT', { month: 'long' });
    //             this.allMonths.push(monthName);
    //         }
    //     }
    // }

    generateDaysForMonth(month: number) {
        this.allDays = [];
        const startDate = new Date(this.selectedYear, month, 1);
        const endDate = new Date(this.selectedYear, month + 1, 0);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            this.allDays.push(new Date(d));
        }
    }

    getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    getAbsenceOrAttendancesType(user: User, day: Date): string {

        const dayTime = new Date(day.setHours(0, 0, 0, 0)).getTime();

        // Controlla prima nelle assenze
        const absence = user.absences.find(absence =>
            absence.date.split(',').some(dateStr => {
                const [day, month, year] = dateStr.trim().split('-').map(Number);
                const absenceDate = new Date(year, month - 1, day).getTime();
                return absenceDate === dayTime;
            })
        );


        if (absence) {
            return absence.type;
        }

        // Se non c'è assenza, controlla se è presente nelle presenze
        const attendance = user.attendances.find(attendance =>
            attendance.date.split(',').some(dateStr => {
                const [day, month, year] = dateStr.trim().split('-').map(Number);
                const attendanceDate = new Date(year, month - 1, day).getTime();
                return attendanceDate === dayTime;
            })
        );
        if (attendance) {
            return attendance.type;
        }
        return ''
    }


    getDayClasses(user: User, day: Date): any {
        const absenceType = this.getAbsenceOrAttendancesType(user, day);
        const isToday = this.isToday(day);
        return {
            'current-day': isToday,
            'malattia': absenceType === 'Malattia',
            'permesso': absenceType === 'Permesso',
            'permesso-rol': absenceType === 'Permesso ROL',
            'ferie': absenceType === 'Ferie',
            'weekend': day.getDay() === 0 || day.getDay() === 6
        };
    }

    getAbsenceSymbol(user: User, day: Date): string {
        const absenceOrAttendanceType = this.getAbsenceOrAttendancesType(user, day);
        switch (absenceOrAttendanceType) {
            case 'Malattia': return 'M';
            case 'Ferie': return 'F';
            case 'Permesso': return 'P';
            case 'Permesso ROL': return 'Pr';
            case 'Presente': return '8';
            case 'Verificare': return '-';
            case 'CheckOut?': return '?';

            default: return absenceOrAttendanceType.slice(0, 2).toUpperCase();
        }
    }

    getMonthHeaderClasses(monthIndex: number): any {
        // Implement logic for month header classes if needed
        return {};
    }

    getDayHeaderClasses(day: Date): any {
        return {
            'weekend': day.getDay() === 0 || day.getDay() === 6
        };
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
    }

    calculateFerieTotals() {
        const startDate = new Date(this.workForceForm.get('startDate')?.value);
        const endDate = new Date(this.workForceForm.get('endDate')?.value);

        return this.userPermissions?.map((user: User) => {
            const ferieCount = user.absences
                .filter(absence => absence.type === 'Ferie')
                .reduce((count, absence) => {
                    const dates = absence.date.split(',');
                    return count + dates
                        .map(dateStr => {
                            const [day, month, year] = dateStr.trim().split('-').map(Number);
                            const date = new Date(year, month - 1, day);
                            return (date >= startDate && date <= endDate) ? 1 : 0;
                        })
                        .reduce((a, b) => a + b, 0);
                }, 0);

            return { ferieCount };
        });
    }


    calculatePermissionROLTotals() {
        const startDate = new Date(this.workForceForm.get('startDate')?.value);
        const endDate = new Date(this.workForceForm.get('endDate')?.value);

        return this.userPermissions?.map((user: User) => {
            const permissionROLCount = user.absences
                .filter(absence => absence.type === 'Permesso ROL')
                .reduce((count, absence) => {
                    const dates = absence.date.split(',');
                    return count + dates
                        .map(dateStr => {
                            const [day, month, year] = dateStr.trim().split('-').map(Number);
                            const date = new Date(year, month - 1, day);
                            return (date >= startDate && date <= endDate) ? 1 : 0;
                        })
                        .reduce((a, b) => a + b, 0);
                }, 0);

            return { permissionROLCount };
        });
    }


    calculateMalattieTotals() {
        const startDate = new Date(this.workForceForm.get('startDate')?.value);
        const endDate = new Date(this.workForceForm.get('endDate')?.value);
        return this.userPermissions?.map((user: User) => {
            const malattieCount = user.absences.filter(absence => absence.type === 'Malattia')

                .reduce((count, absence) => {
                    const dates = absence.date.split(',');
                    return count + dates
                        .map(dateStr => {
                            const [day, month, year] = dateStr.trim().split('-').map(Number);
                            const date = new Date(year, month - 1, day);
                            return (date >= startDate && date <= endDate) ? 1 : 0;
                        })
                        .reduce((a, b) => a + b, 0);
                }, 0);
            return { malattieCount };
        });
    }

    calculateTotal(absenceType: 'permissionROLCount' | 'ferieCount' | 'malattieCount'): number {
        return this.userPermissions?.reduce((total, user) => {
            const count = this.calculateCountForUser(user, absenceType);
            return total + count;
        }, 0) || 0;
    }

    private calculateCountForUser(user: User, absenceType: 'permissionROLCount' | 'ferieCount' | 'malattieCount'): number {
        switch (absenceType) {
            case 'permissionROLCount':
                return user.absences
                    .filter(absence => absence.type === 'Permesso ROL')
                    .reduce((count, absence) => {
                        const dates = absence.date.split(',');
                        return count + dates
                            .map(dateStr => {
                                const [day, month, year] = dateStr.trim().split('-').map(Number);
                                const date = new Date(year, month - 1, day);
                                return (date >= new Date(this.workForceForm.get('startDate')?.value) &&
                                    date <= new Date(this.workForceForm.get('endDate')?.value)) ? 1 : 0;
                            })
                            .reduce((a, b) => a + b, 0);
                    }, 0);
            case 'ferieCount':
                return user.absences
                    .filter(absence => absence.type === 'Ferie')
                    .reduce((count, absence) => {
                        const dates = absence.date.split(',');
                        return count + dates
                            .map(dateStr => {
                                const [day, month, year] = dateStr.trim().split('-').map(Number);
                                const date = new Date(year, month - 1, day);
                                return (date >= new Date(this.workForceForm.get('startDate')?.value) &&
                                    date <= new Date(this.workForceForm.get('endDate')?.value)) ? 1 : 0;
                            })
                            .reduce((a, b) => a + b, 0);
                    }, 0);
            case 'malattieCount':
                return user.absences
                    .filter(absence => absence.type === 'Malattia')
                    .reduce((count, absence) => {
                        const dates = absence.date.split(',');
                        return count + dates
                            .map(dateStr => {
                                const [day, month, year] = dateStr.trim().split('-').map(Number);
                                const date = new Date(year, month - 1, day);
                                return (date >= new Date(this.workForceForm.get('startDate')?.value) &&
                                    date <= new Date(this.workForceForm.get('endDate')?.value)) ? 1 : 0;
                            })
                            .reduce((a, b) => a + b, 0);
                    }, 0);
        }
    }

    scrollCenterPaneToCurrentDate() {
        if (this.centerPaneRef && this.centerPaneRef.nativeElement) {
            const currentDayElement = this.centerPaneRef.nativeElement.querySelector('.current-day');
            if (currentDayElement) {
                const paneWidth = this.centerPaneRef.nativeElement.clientWidth;
                const dayWidth = currentDayElement.clientWidth;
                const dayLeftOffset = currentDayElement.offsetLeft;
                const scrollPosition = dayLeftOffset - (paneWidth / 2) + (dayWidth / 2);
                this.centerPaneRef.nativeElement.scrollLeft = scrollPosition;
            } else {
                console.log('Element with class .current-day not found.');
            }
        } else {
            console.log('centerPaneRef or its nativeElement is null or undefined.');
        }
    }
}
