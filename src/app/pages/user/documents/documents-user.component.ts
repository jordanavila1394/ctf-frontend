import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UploadService } from 'src/app/services/upload.service';

@Component({
    selector: 'app-documents-user',
    templateUrl: './documents-user.component.html',
    styleUrls: ['./documents-user.component.scss'],
})
export class DocumentsUserComponent {
    uploadedFiles: any[] = [];

    categoriesItems = [
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
    ];

    documentsForm = this.fb.group({
        category: ['', [Validators.required]],
        fiscalCode: ['', [Validators.required]],
    });
    currentFiscalCode: any;

    constructor(
        private messageService: MessageService,
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private uploadService: UploadService,
    ) {
        this.route.queryParams.subscribe((params) => {
            this.currentFiscalCode = params['fiscalCode'];
            this.documentsForm.patchValue({
                fiscalCode: params['fiscalCode'],
            });
        });
    }

    uploadFiles(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
    saveCheckOut() {
        const formData = new FormData();

        for (let file of this.uploadedFiles) {
            formData.append('files', file);
        }

        //TARGA
        const category = this.documentsForm.value.category;
        formData.append('category', category);

        this.uploadService.uploadDocuments(formData).subscribe(
            (response) => {},
            (error) => {},
        );
    }
}
