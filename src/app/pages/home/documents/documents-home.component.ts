import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/download.service';
import { SpacesService } from 'src/app/services/spaces.service';
import { UploadService } from 'src/app/services/upload.service';

import { AuthState } from 'src/app/stores/auth/authentication.reducer';

@Component({
    templateUrl: './documents-home.component.html',
    styleUrls: ['./documents-home.component.scss'],
})
export class DocumentsHomeComponent {
    authState$: Observable<AuthState>;

    uploadedFiles: any[] = [];
    filesSpaces: AWS.S3.Object[];
    files: any;
    filesCedoliniDocument: any;
    filesCUDDocument: any;

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

    documentsForm = this.fb.group({
        userId: ['', [Validators.required]],
        category: ['', [Validators.required]],
        fiscalCode: ['', [Validators.required]],
    });
    currentFiscalCode: any;
    selectedCategory: any;
    subscription: Subscription;
    currentUser: any;

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private uploadService: UploadService,
        private downloadService: DownloadService,
        private spacesService: SpacesService,
        private store: Store<{ authState: AuthState }>,
    ) {
        this.authState$ = store.select('authState');
        this.authState$.subscribe((authS) => {
            this.currentUser = authS?.user || '';
            this.documentsForm.patchValue({
                fiscalCode: authS?.user.fiscalCode,
                userId: authS?.user.id,
            });
            this.loadServices(this.currentUser.id, this.currentUser.fiscalCode);
        });
    }

    loadServices(idUser, fiscalCode) {
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

        if (downloadServiceSubscription && this.subscription)
            this.subscription.add(downloadServiceSubscription);
        if (downloadCedoliniDocumentServiceSubscription && this.subscription)
            this.subscription.add(downloadCedoliniDocumentServiceSubscription);
         if (downloadCUDDocumentServiceSubscription && this.subscription)
             this.subscription.add(downloadCUDDocumentServiceSubscription);
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
        const fiscalCode = this.documentsForm.value.fiscalCode;

        formData.append('userId', userId);
        formData.append('category', category);
        formData.append('fiscalCode', fiscalCode);

        this.uploadService.uploadDocuments(formData).subscribe(
            (response) => {
                this.loadServices(userId, fiscalCode);
            },
            (error) => {},
        );
    }
    deleteDocument(file) {
        this.uploadService.deleteDocument(file).subscribe(
            (response) => {
                this.loadServices(this.documentsForm.value.userId, this.documentsForm.value.fiscalCode);
            },
            (error) => { },
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
}
