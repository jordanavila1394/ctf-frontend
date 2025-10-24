import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
import * as moment from 'moment';

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

    monthsItems: any[] = [];
    yearsItems: any[] = [];
    selectedReleaseMonth;
    selectedReleaseYear;

    constructor(
        public fb: FormBuilder,
        private uploadService: UploadService,
        private messageService: MessageService,
        private userService: UserService,
    ) {
        moment.locale('it');
        this.monthsItems = this.getAllMonths();
        this.yearsItems = this.getLast5Years();

        const currentMonth = moment().month() + 1;
        this.selectedReleaseMonth = this.monthsItems.find(
            (month) => month.value === currentMonth,
        );

        const currentYear = moment().year();
        this.selectedReleaseYear = this.yearsItems.find(
            (year) => year.value === currentYear,
        );
    } // Inject UploadService
    documentsForm = this.fb.group({
        userId: ['', [Validators.required]],
        category: ['', [Validators.required]],
        expireDate: [''],
        releaseMonth: [''],
        releaseYear: [''],
        fiscalCode: ['', [Validators.required]],
    });

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
    openFilePicker(): void {
        const fileInput = document.getElementById(
            'fileInput',
        ) as HTMLInputElement;
        fileInput.click();
    }

    uploadAllCedolini() {
        if (this.fiscalCodesFounded.length === 0) {
            alert(
                'No fiscal codes found to upload. ' + this.fiscalCodesFounded,
            );
            return;
        }

        // Cicla attraverso ogni item in fiscalCodesFounded
        this.fiscalCodesFounded.forEach(async (item: any) => {
            console.log('caricamento ');
            await this.savePageAsDocument(item); // Chiama savePageAsDocument per salvare il documento
        });
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
            alert('Nessun codice fiscale trovato.');
            return;
        }
        const userExists = await this.checkIfExistUser(item.fiscalCode);
        console.log(userExists);
        if (!userExists) {
            this.messageService.add({
                severity: 'error',
                summary: item.fiscalCode,
                detail: 'Non esiste utente ',
            });
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
            `CEDOLINO_${item.fiscalCode}.pdf`
        );

        const releaseYear = this.selectedReleaseYear?.name;
        const releaseMonth = this.selectedReleaseMonth?.name;
        const subject = `Cedolino ${releaseMonth} ${releaseYear}`;
        const message = `In allegato il cedolino per ${item.fiscalCode}`;

        // Dati utente
        const user = await this.userService.getUserByFiscalCode(item.fiscalCode).toPromise();
        this.proceedWithUploadAndEmail(user, formData, item, releaseYear, releaseMonth, subject);

    }

    proceedWithUploadAndEmail(
        user: any,
        formData: FormData,
        item: any,
        releaseYear: any,
        releaseMonth: any,
        subject: string
    ) {
        if (!user) {
            this.messageService.add({
                severity: 'error',
                summary: item.fiscalCode,
                detail: 'Utente non trovato',
            });
            return;
        }

        const message = `
        Gentile ${user.name} ${user.surname},<br><br>
        in allegato trova il cedolino relativo al mese di <strong>${releaseMonth} ${releaseYear}</strong>.<br><br>
        <strong>Codice Fiscale:</strong> ${item.fiscalCode}<br>
        <strong>Nome:</strong> ${user.name}<br>
        <strong>Cognome:</strong> ${user.surname}<br><br>
        Cordiali saluti,<br>
        <em>CTF Italia</em>
    `;

        formData.append('userId', user?.id);
        formData.append('category', 'cedolino');
        formData.append('fiscalCode', item.fiscalCode);
        formData.append('releaseYear', releaseYear);
        formData.append('releaseMonth', releaseMonth);
        formData.append('email', user.email);
        formData.append('subject', subject);
        formData.append('message', message);

        console.log('📦 FormData pronto per uploadDocumentsAndSendEmail:', {
            fiscalCode: item.fiscalCode,
            releaseMonth,
            releaseYear,
            email: user.email,
            subject,
            message,
        });

        this.uploadService.uploadDocumentsAndSendEmail(formData).subscribe(
            (response) => {
                console.log('✅ Upload + Email successful:', response);
                this.messageService.add({
                    severity: 'success',
                    summary: item.fiscalCode,
                    detail: 'Documento caricato e email inviata',
                });
            },
            (error) => {
                console.error('❌ Upload + Email failed:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: item.fiscalCode,
                    detail: 'Errore durante upload o invio email',
                });
            }
        );
    }



}
