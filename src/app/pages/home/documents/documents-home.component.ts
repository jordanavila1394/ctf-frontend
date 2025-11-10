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

    groupedCedolini: {
        year: string;
        months: {
            month: string;
            files: any[];
        }[];
    }[] = [];

    monthMap: { [key: string]: number } = {
        gennaio: 1,
        febbraio: 2,
        marzo: 3,
        aprile: 4,
        maggio: 5,
        giugno: 6,
        luglio: 7,
        agosto: 8,
        settembre: 9,
        ottobre: 10,
        novembre: 11,
        dicembre: 12,
    };

    categoriesItems = [
        { name: 'Cedolino', id: 'cedolino' },
        { name: 'CUD', id: 'cud' },
        { name: 'Documenti Identità', id: 'documento-identita' },
        { name: 'Patente', id: 'patente' },
        { name: 'Patente ADR', id: 'patente-adr' },
        { name: 'Permesso soggiorno', id: 'permesso-soggiorno' },
        { name: 'Contratto lavoro', id: 'contratto-lavoro' },
        { name: 'Altro', id: 'altro' },
    ];

    documentsForm = this.fb.group({
        userId: ['', [Validators.required]],
        category: ['', [Validators.required]],
        fiscalCode: ['', [Validators.required]],
    });

    currentFiscalCode: any;
    selectedCategory: any;
    subscription: Subscription = new Subscription();
    currentUser: any;

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private uploadService: UploadService,
        private downloadService: DownloadService,
        private spacesService: SpacesService,
        private store: Store<{ authState: AuthState }>
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



    loadServices(idUser: string, fiscalCode: string) {
        const downloadServiceSubscription = this.downloadService
            .getDocumentsByUser(idUser, fiscalCode)
            .subscribe((files) => {
                this.files = files;
            });

        const downloadCedoliniDocumentServiceSubscription = this.downloadService
            .getCedoliniDocumentsByUser(idUser, fiscalCode)
            .subscribe((files) => {
                this.filesCedoliniDocument = files;
                this.groupCedoliniByYearAndMonth(files);
            });

        const downloadCUDDocumentServiceSubscription = this.downloadService
            .getCUDDocumentsByUser(idUser, fiscalCode)
            .subscribe((files) => {
                this.filesCUDDocument = files;
            });

        this.subscription.add(downloadServiceSubscription);
        this.subscription.add(downloadCedoliniDocumentServiceSubscription);
        this.subscription.add(downloadCUDDocumentServiceSubscription);
    }




    groupCedoliniByYearAndMonth(files: any[]) {
        const temp: {
            [year: string]: {
                [month: string]: any[];
            };
        } = {};

        for (const file of files) {
            const year = file.releaseYear;
            const rawMonth = file.releaseMonth?.toLowerCase()?.trim();
            const month = rawMonth in this.monthMap ? rawMonth : 'gennaio'; // fallback

            if (!temp[year]) temp[year] = {};
            if (!temp[year][month]) temp[year][month] = [];

            temp[year][month].push(file);
        }

        this.groupedCedolini = Object.keys(temp)
            .sort((a, b) => parseInt(b) - parseInt(a)) // anni decrescenti
            .map((year) => ({
                year,
                months: Object.keys(temp[year])
                    .sort((a, b) => this.monthMap[b] - this.monthMap[a]) // mesi decrescenti
                    .map((month) => ({
                        month,
                        files: temp[year][month].sort(
                            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        ),
                    })),
            }));
    }

    getFileUrl(key: string): string {
        return this.spacesService.s3.getSignedUrl('getObject', {
            Bucket: this.spacesService.bucketName,
            Key: key,
            Expires: 3600,
        });
    }

    uploadFiles(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }

    saveDocument() {
        const formData = new FormData();

        for (let file of this.uploadedFiles) {
            formData.append('files', file);
        }

        const userId = this.documentsForm.value.userId;
        const category = this.selectedCategory?.id || 'altro';
        const fiscalCode = this.documentsForm.value.fiscalCode;

        formData.append('userId', userId);
        formData.append('category', category);
        formData.append('fiscalCode', fiscalCode);

        this.uploadService.uploadDocuments(formData).subscribe(
            () => {
                this.loadServices(userId, fiscalCode);
            },
            (error) => {
                console.error('Errore upload:', error);
            }
        );
    }

    deleteDocument(file: string) {
        this.uploadService.deleteDocument(file).subscribe(
            () => {
                this.loadServices(this.documentsForm.value.userId, this.documentsForm.value.fiscalCode);
            },
            (error) => {
                console.error('Errore delete:', error);
            }
        );
    }

    getFileName(file: string): string {
        return file.substring(file.lastIndexOf('/') + 1);
    }

    getFileExtension(file: string): string {
        return file.substring(file.lastIndexOf('/') + 1).split('.').pop();
    }
}
