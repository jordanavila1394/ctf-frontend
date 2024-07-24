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
}

interface Absence {
    date: string;
    type: AbsenceType;
}

type AbsenceType = 'Malattia' | 'Ferie' | 'Permesso' | 'Permesso ROL';

@Component({
    selector: 'app-table-workforce',
    templateUrl: './table-workforce.component.html',
    styleUrls: ['./table-workforce.component.scss']
})
export class TableWorkforceComponent implements OnInit, AfterViewInit, OnDestroy {
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
   
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private userService: UserService,
        private permissionService: PermissionService,
        private cdRef: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.workForceForm = this.fb.group({
            associatedClient: [null, Validators.required],
            startDate: [new Date(this.currentYear, 0, 1), Validators.required],
            endDate: [new Date(this.currentYear, 11, 31), Validators.required]
        });
    }

    ngOnInit(): void {
        this.getAllAssociatedClients();
        this.generateMonthsAndDays();

        // Listen for changes to the selectedClient and fetch new permissions
        this.workForceForm.get('associatedClient')?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(selectedClient => {
                this.selectedClient = selectedClient;
                this.getAllPermissionsByClient();
            });

        // Listen for changes to the startDate and endDate and regenerate days
        this.workForceForm.get('startDate')?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.generateMonthsAndDays();
                this.getAllPermissionsByClient();
            });

        this.workForceForm.get('endDate')?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.generateMonthsAndDays();
                this.getAllPermissionsByClient();
            });

        // Initial load of permissions
        this.getAllPermissionsByClient();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    getAllPermissionsByClient() {
        const startDate = this.workForceForm.get('startDate')?.value;
        const endDate = this.workForceForm.get('endDate')?.value;
        this.permissionService.getPermissionsByClient(this.selectedClient, startDate, endDate)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => this.userPermissions = data);
    }

    getAllAssociatedClients() {
        this.userService.getAllAssociatedClients()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                clients => this.associatedClients = clients,
                error => console.error('Error fetching associated clients:', error)
            );
    }

    generateMonthsAndDays() {
        this.allMonths = [];
        this.allDays = [];
        const startDate = new Date(this.workForceForm.get('startDate')?.value || new Date(this.currentYear, 0, 1));
        const endDate = new Date(this.workForceForm.get('endDate')?.value || new Date(this.currentYear, 11, 31));

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            this.allDays.push(new Date(d));
            if (d.getDate() === 1) {
                const monthName = d.toLocaleDateString('it-IT', { month: 'long' });
                this.allMonths.push(monthName);
            }
        }
    }

    getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    getAbsenceType(user: User, day: Date): string {
        const dayTime = new Date(day.setHours(0, 0, 0, 0)).getTime();
        const absence = user.absences.find(absence =>
            absence.date.split(',').some(dateStr => {
                const [day, month, year] = dateStr.trim().split('-').map(Number);
                const absenceDate = new Date(year, month - 1, day).getTime();
                return absenceDate === dayTime;
            })
        );
        return absence ? absence.type : '';
    }

    getDayClasses(user: User, day: Date): any {
        const absenceType = this.getAbsenceType(user, day);
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
        const absenceType = this.getAbsenceType(user, day);
        switch (absenceType) {
            case 'Malattia': return 'M';
            case 'Ferie': return 'F';
            case 'Permesso': return 'P';
            case 'Permesso ROL': return 'Pr';
            default: return '';
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
