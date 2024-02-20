import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
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

        const codiceFiscale = await this.searchPdfForCodiceFiscale(this.pdfSrc);
        console.log('Codice Fiscale:', codiceFiscale);
    }

    async searchPdfForCodiceFiscale(pdfUrl: string) {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        let pdfText = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => {
                    if (item['str'].match(this.codiceFiscaleRegex)) {
                        this.fiscalCodesFounded.push({
                            fiscalCode: item['str'],
                            page: i,
                        });
                    }
                    return item['str'];
                })
                .join(' ');
        }
    }
}
