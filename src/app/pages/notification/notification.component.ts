//Angular
import { Component, OnInit, OnDestroy } from '@angular/core';

//PrimeNg

//Models

//Services
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AttendanceService } from 'src/app/services/attendance.service';

//Store
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';

//Libraies
import * as moment from 'moment';

//Utils
import Formatter from 'src/app/utils/formatters';
import { PermissionService } from 'src/app/services/permission.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmailService } from 'src/app/services/email.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class NotificationComponent {
    //Language
    locale: string;

    //Utils
    formatter!: Formatter;

    //Store
    subscription: Subscription;
    companyState$: Observable<CompanyState>;

    messageForm = this.fb.group({
        userId: ['', [Validators.required]],
        message: ['', [Validators.required]],
    });

    constructor(
        public layoutService: LayoutService,
        public translateService: TranslateService,
        public fb: FormBuilder,
        public emailService: EmailService,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        //Init
        this.formatter = new Formatter();
        this.companyState$ = store.select('companyState');
    }

    ngOnInit(): void {}
    sendMessageAdmin() {
        const userId = this.messageForm.value.userId;
        const message = this.messageForm.value.message;
        //HANDLE SEND MESSAGE
    }
}
