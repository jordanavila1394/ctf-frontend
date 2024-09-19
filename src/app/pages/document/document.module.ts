import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentRoutingModule } from './document-routing.module';
import { ExpiredDocumentComponent } from './expired/expired-document.component';

@NgModule({
    imports: [CommonModule, DocumentRoutingModule],
})
export class DocumentModule {}
