import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { SpacesService } from 'src/app/services/spaces.service';

@Component({
  selector: 'app-expired-document',
  templateUrl: './expired-document.component.html',
  styleUrls: ['./expired-document.component.scss']
})
export class ExpiredDocumentComponent implements OnInit {
  documents: any[] = [];
  filteredDocuments: any[] = [];

  // Filtri
  filterCategory: string = '';
  filterName: string = '';
  filterSurname: string = '';
  filterFiscalCode: string = '';

  categories = [
    { value: 'cedolino', label: 'Cedolino' },
    { value: 'cud', label: 'CUD' },
    { value: 'documento-identita', label: 'Documento Identità' },
    { value: 'patente', label: 'Patente' },
    { value: 'patente-adr', label: 'Patente ADR' },
    { value: 'permesso-soggiorno', label: 'Permesso soggiorno' },
    { value: 'contratto-lavoro', label: 'Contratto lavoro' },
    { value: 'altro', label: 'Altro' }
  ];


  constructor(
    private documentService: DocumentService,
    private spacesService: SpacesService
  ) { }

  ngOnInit(): void {
    this.getExpiringDocuments();
  }

  getFileUrl(key: string): string {
    return this.spacesService.s3.getSignedUrl('getObject', {
      Bucket: this.spacesService.bucketName,
      Key: key,
      Expires: 3600,
    });
  }

  getExpiringDocuments(): void {
    this.documentService.getDocumentsExpiring().subscribe(
      (data) => {
        this.documents = data.data.sort((a, b) => {
          return new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime();
        });
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching documents', error);
      }
    );
  }

  getCategoryLabel(value: string): string {
    const category = this.categories.find(c => c.value === value);
    return category ? category.label : 'Altro';
  }


  applyFilters(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      return (!this.filterCategory || doc.category === this.filterCategory) &&
        (!this.filterName || doc.user?.name?.toLowerCase().includes(this.filterName.toLowerCase())) &&
        (!this.filterSurname || doc.user?.surname?.toLowerCase().includes(this.filterSurname.toLowerCase())) &&
        (!this.filterFiscalCode || doc.fiscalCode?.toLowerCase().includes(this.filterFiscalCode.toLowerCase()));
    });
  }
}
