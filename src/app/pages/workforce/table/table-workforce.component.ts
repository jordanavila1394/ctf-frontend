import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

interface User {
    id: number;
    name: string;
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
        private fb: FormBuilder,
    ) {
        this.workForceForm = this.fb.group({
            associatedClient: [null, Validators.required],
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
        this.permissionService.getPermissionsByClient(this.selectedClient)
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
        const currentYear = this.currentYear;
        for (let month = 0; month < 12; month++) {
            const monthDate = new Date(currentYear, month);
            const monthName = monthDate.toLocaleDateString('it-IT', { month: 'long' });
            this.allMonths.push(monthName);

            const daysInMonth = this.getDaysInMonth(currentYear, month);
            for (let day = 1; day <= daysInMonth; day++) {
                this.allDays.push(new Date(currentYear, month, day));
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

    scrollCenterPaneToCurrentDate() {
        console.log('Scrolling to current date');
        if (this.centerPaneRef && this.centerPaneRef.nativeElement) {
            const currentDayElement = this.centerPaneRef.nativeElement.querySelector('.current-day');
            console.log('Current day element:', currentDayElement);
            if (currentDayElement) {
                const paneWidth = this.centerPaneRef.nativeElement.clientWidth;
                const dayWidth = currentDayElement.clientWidth;
                const dayLeftOffset = currentDayElement.offsetLeft;

                console.log('Pane width:', paneWidth);
                console.log('Day width:', dayWidth);
                console.log('Day left offset:', dayLeftOffset);

                const scrollPosition = dayLeftOffset - (paneWidth / 2) + (dayWidth / 2);
                console.log('Scroll position:', scrollPosition);
                this.centerPaneRef.nativeElement.scrollLeft = scrollPosition;
            } else {
                console.log('Element with class .current-day not found.');
            }
        } else {
            console.log('centerPaneRef or its nativeElement is null or undefined.');
        }
    }
}
