import { Component } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Component({
    selector: 'app-pdf-splitter',
    templateUrl: './pdf-splitter.component.html',
    styleUrls: ['./pdf-splitter.component.css'],
})
export class PdfSplitterComponent {
    pdfSrc: any;
    droppedFiles: File[] = [];

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

        const pdfBytes = new Uint8Array(this.pdfSrc);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const form = pdfDoc.getForm();
        const fields = form.getFields();
        fields.forEach((field) => {
            const type = field.constructor.name;
            const name = field.getName();
            console.log(`${type}: ${name}`);
        });
        console.log(fields);
    }
}
