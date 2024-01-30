import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dropdown-notifications',
    templateUrl: './dropdown-notifications.component.html',
    styleUrls: ['./dropdown-notifications.component.scss'],
})
export class DropdownNotificationsComponent {
    isOpen = false;
    notifications: string[] = [];
    private subscriptions: Subscription[] = [];

    constructor() {}

    ngOnInit(): void {}

    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }
}
