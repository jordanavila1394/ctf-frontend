import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/download.service';
import { SpacesService } from 'src/app/services/spaces.service';
import { UploadService } from 'src/app/services/upload.service';
import * as moment from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-documents-user',
    templateUrl: './documents-user.component.html',
    styleUrls: ['./documents-user.component.scss'],
})
export class DocumentsUserComponent {
    uploadedFiles: any[] = [];
    filesSpaces: AWS.S3.Object[];
    files: any;
    filesCedoliniDocument: any;
    filesCUDDocument: any
    //Language
    locale: string;

    categoriesItems = [
        {
            name: 'Cedolino',
            id: 'cedolino',
        },
        {
            name: 'CUD',
            id: 'cud',
        },
        {
            name: 'Documenti Identità',
            id: 'documento-identita',
        },
        {
            name: 'Patente',
            id: 'patente',
        },
        {
            name: 'Patente ADR',
            id: 'patente-adr',
        },
        {
            name: 'Permesso soggiorno',
            id: 'permesso-soggiorno',
        },
        {
            name: 'Contratto lavoro',
            id: 'contratto-lavoro',
        },
        {
            name: 'Altro',
            id: 'altro',
        },
    ];

    monthsItems: any[] = [];
    yearsItems: any[] = [];
    selectedReleaseMonth;
    selectedReleaseYear;

    documentsForm = this.fb.group({
        userId: ['', [Validators.required]],
        category: ['', [Validators.required]],
        expireDate: [''],
        releaseMonth: [''],
        releaseYear: [''],
        fiscalCode: ['', [Validators.required]],
    });
    selectedCategory: any;
    subscription: Subscription;
    currentFiscalCode: any;
    currentUserId: any;
    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private uploadService: UploadService,
        public translateService: TranslateService,
        private downloadService: DownloadService,
        private spacesService: SpacesService,
    ) {
        this.route.queryParams.subscribe((params) => {
            this.currentFiscalCode = params['fiscalCode'];
            this.currentUserId = params['id'];
            this.documentsForm.patchValue({
                fiscalCode: params['fiscalCode'],
                userId: params['id'],
            });
            this.loadServices(params['id'], params['fiscalCode']);
        });
        moment.locale(this.locale);
        this.monthsItems = this.getAllMonths();
        this.yearsItems = this.getLast5Years();
    }

    loadServices(idUser, fiscalCode) {
        moment.locale(this.locale);
        const downloadServiceSubscription = this.downloadService
            .getDocumentsByUser(idUser, fiscalCode)
            .subscribe((files) => {
                this.files = files;
            });

        const downloadCedoliniDocumentServiceSubscription = this.downloadService
            .getCedoliniDocumentsByUser(idUser, fiscalCode)
            .subscribe((files) => {
                this.filesCedoliniDocument = files;
            });
        
        const downloadCUDDocumentServiceSubscription = this.downloadService
            .getCUDDocumentsByUser(idUser, fiscalCode)
            .subscribe((files) => {
                this.filesCUDDocument = files;
            });
        
        const translateServiceSubscription =
            this.translateService.onLangChange.subscribe(
                (langChangeEvent: LangChangeEvent) => {
                    this.locale = langChangeEvent.lang;
                    moment.locale(this.locale);
                },
            );
        if (downloadServiceSubscription && this.subscription)
            this.subscription.add(downloadServiceSubscription);
        if (downloadCedoliniDocumentServiceSubscription && this.subscription)
            this.subscription.add(downloadCedoliniDocumentServiceSubscription);
         if (downloadCUDDocumentServiceSubscription && this.subscription)
             this.subscription.add(downloadCUDDocumentServiceSubscription);
        if (translateServiceSubscription && this.subscription)
            this.subscription.add(translateServiceSubscription);
    }

    getAllMonths(): any[] {
        const months: any[] = [];
        for (let i = 0; i < 12; i++) {
            const monthName = moment().month(i).format('MMMM');
            months.push({ name: monthName, value: i + 1 }); // Adjust value if needed
        }
        return months;
    }

    getLast5Years(): any[] {
        const years: any[] = [];
        const currentYear = moment().year();
        for (let i = 0; i < 5; i++) {
            years.push({ name: currentYear - i, value: currentYear - i });
        }
        return years;
    }

    onChangeCategoryDocument() {
        if (
            this.selectedCategory?.id === 'cud' ||
            this.selectedCategory?.id === 'cedolino'
        ) {
            if (this.selectedCategory?.id === 'cedolino') {
                const currentMonth = moment().month() + 1;
                this.selectedReleaseMonth = this.monthsItems.find(
                    (month) => month.value === currentMonth,
                );
            }

            const currentYear = moment().year();
            this.selectedReleaseYear = this.yearsItems.find(
                (year) => year.value === currentYear,
            );
        }
    }
    getFileUrl(key: string): string {
        return this.spacesService.s3.getSignedUrl('getObject', {
            Bucket: this.spacesService.bucketName,
            Key: key,
            Expires: 3600, // Tempo di scadenza del link in secondi
        });
    }

    uploadFiles(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
    saveDocument() {
        const formData = new FormData();

        for (let file of this.uploadedFiles) {
            formData.append('files', file);
        }

        //TARGA
        const userId = this.documentsForm.value.userId;
        const category = this.selectedCategory?.id
            ? this.selectedCategory?.id
            : 'altro';
        const expireDate = this.documentsForm.value.expireDate;
        const fiscalCode = this.documentsForm.value.fiscalCode;
        const releaseYear = this.selectedReleaseYear?.name;
        const releaseMonth = this.selectedReleaseMonth?.name;

        formData.append('userId', userId);
        formData.append('category', category);
        formData.append('expireDate', expireDate);
        formData.append('fiscalCode', fiscalCode);
        formData.append('releaseYear', releaseYear);
        formData.append('releaseMonth', releaseMonth);

        this.uploadService.uploadDocuments(formData).subscribe(
            (response) => {
                this.loadServices(userId, fiscalCode);
            },
            (error) => {},
        );
    }

    getFileName(file) {
        return file.substring(file.lastIndexOf('/') + 1);
    }

    getFileExtension(file) {
        return file
            .substring(file.lastIndexOf('/') + 1)
            .split('.')
            .pop();
    }
    deleteDocument(file) {
        this.uploadService.deleteDocument(file).subscribe(
            (response) => {
                this.loadServices(this.currentUserId, this.currentFiscalCode);
            },
            (error) => {},
        );
    }
}
