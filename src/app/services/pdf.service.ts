// pdf.service.ts
import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  loadPdf(url: string): Promise<any> {
    return pdfjsLib.getDocument(url).promise;
  }

  getTextContent(page: any): Promise<any> {
    return page.getTextContent();
  }
}
