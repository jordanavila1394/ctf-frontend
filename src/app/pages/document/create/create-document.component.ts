import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFPageProxy } from 'pdfjs-dist';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import { Observable, catchError, from, map, of, switchMap, take } from 'rxjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

@Component({
    templateUrl: './create-document.component.html',
    styleUrls: ['./create-document.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class CreateDocumentComponent {
    pdfSrc: any;
    droppedFiles: File[] = [];
    pdfText: string = '';
    codiceFiscaleRegex =
        '^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$';
    fiscalCodesFounded: any = [];

    constructor(
        private uploadService: UploadService,
        private userService: UserService,
    ) {} // Inject UploadService

    openFilePicker(): void {
        const fileInput = document.getElementById(
            'fileInput',
        ) as HTMLInputElement;
        fileInput.click();
    }

    onFileSelected(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const file: File | null = (inputElement.files as FileList)[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.pdfSrc = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onFileDropped(event: any): void {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        this.handleFiles(files);
    }

    onDragOver(event: any): void {
        event.preventDefault();
        event.stopPropagation();
    }

    handleFiles(files: File[]): void {
        this.droppedFiles = files;
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.pdfSrc = e.target?.result;
            };
            reader.readAsArrayBuffer(files[0]);
        }
    }

    async splitPdf(): Promise<void> {
        if (!this.pdfSrc) {
            alert('Please drop a PDF file first.');
            return;
        }

        await this.searchPdfForCodiceFiscale();
    }

    async searchPdfForCodiceFiscale() {
        const pdf = await pdfjsLib.getDocument(this.pdfSrc).promise;
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            textContent.items
                .map((item) => {
                    if (item['str'].match(this.codiceFiscaleRegex)) {
                        this.fiscalCodesFounded.push({
                            fiscalCode: item['str'].trim().toUpperCase(),
                            pageNumber: i,
                        });
                    }
                    return item['str'];
                })
                .join(' ');
        }
    }

    async checkIfExistUser(fiscalCode: string): Promise<boolean> {
        try {
            const exists = await this.userService
                .checkIfExistUser(fiscalCode)
                .toPromise();
            return exists;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    }

    async savePageAsImg(item: any): Promise<void> {
        if (this.fiscalCodesFounded.length === 0) {
            alert('No fiscal codes found in the PDF.');
            return;
        }

        const pdf = await pdfjsLib.getDocument(this.pdfSrc).promise;
        const page = await pdf.getPage(item?.pageNumber);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context!,
            viewport: viewport,
        };

        await page.render(renderContext).promise;

        const imageData = canvas.toDataURL('image/jpeg');

        const link = document.createElement('a');
        link.href = imageData;
        link.download = `IMG_${item?.fiscalCode}.jpg`;
        link.click();
    }

    async savePageAsPDF(item: any): Promise<void> {
        if (this.fiscalCodesFounded.length === 0) {
            alert('No fiscal codes found in the PDF.');
            return;
        }

        const pdfDoc = await PDFDocument.create();
        const srcDoc = await PDFDocument.load(this.pdfSrc);
        const [copiedPage] = await pdfDoc.copyPages(srcDoc, [
            item.pageNumber - 1,
        ]);
        pdfDoc.addPage(copiedPage);

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `CEDOLINO_${item.fiscalCode}.pdf`;
        link.click();
    }

    async savePageAsDocument(item: any): Promise<void> {
        if (this.fiscalCodesFounded.length === 0) {
            alert('No fiscal codes found in the PDF.');
            return;
        }
        const userExists = await this.checkIfExistUser(item.fiscalCode);
        console.log(userExists)
        if (!userExists) {
            alert('User with the provided fiscal code does not exist.');
            return;
        }


        const pdfDoc = await PDFDocument.create();
        const srcDoc = await PDFDocument.load(this.pdfSrc);
        const [copiedPage] = await pdfDoc.copyPages(srcDoc, [
            item.pageNumber - 1,
        ]);
        pdfDoc.addPage(copiedPage);

        const pdfBytes = await pdfDoc.save();

        // Upload the saved PDF document
        const formData = new FormData();
        formData.append(
            'files',
            new Blob([pdfBytes], { type: 'application/pdf' }),
            `CEDOLINO_${item.fiscalCode}.pdf`,
        );

        formData.append('userId', '0');
        formData.append('category', 'cedolino');
        formData.append('fiscalCode', item.fiscalCode);

        this.uploadService.uploadDocuments(formData).subscribe(
            (response) => {
                // Handle success
                console.log('Upload successful', response);
            },
            (error) => {
                // Handle error
                console.error('Upload failed', error);
            },
        );
    }
}
