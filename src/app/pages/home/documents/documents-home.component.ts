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
    filesWorkDocument: any;
    categoriesItems = [
        {
            name: 'Cedolino',
            id: 'cedolino',
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
            name: 'Permesso soggiorno',
            id: 'permesso-soggiorno',
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
        const downloadWorkDocumentServiceSubscription = this.downloadService
            .getWorkDocumentsByUser(idUser, fiscalCode)
            .subscribe((files) => {
                this.filesWorkDocument = files;
            });

        if (downloadServiceSubscription && this.subscription)
            this.subscription.add(downloadServiceSubscription);
        if (downloadWorkDocumentServiceSubscription && this.subscription)
            this.subscription.add(downloadWorkDocumentServiceSubscription);
    }

    getFileUrl(key: string): string {
        return this.spacesService.s3.getSignedUrl('getObject', {
            Bucket: this.spacesService.bucketName,
            Key: key,
            Expires: 60, // Tempo di scadenza del link in secondi
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
