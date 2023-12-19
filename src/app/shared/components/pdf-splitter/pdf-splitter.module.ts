import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfSplitterComponent } from './pdf-splitter.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
    declarations: [PdfSplitterComponent],
    imports: [CommonModule, DropzoneModule, PdfViewerModule,  NgxExtendedPdfViewerModule],
    exports: [PdfSplitterComponent],
})
export class PdfSplitDropzoneModule {}
