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

  constructor(private documentService: DocumentService, private spacesService: SpacesService,
) { }

  ngOnInit(): void {
    this.getExpiringDocuments();
  }

  getFileUrl(key: string): string {
    return this.spacesService.s3.getSignedUrl('getObject', {
      Bucket: this.spacesService.bucketName,
      Key: key,
      Expires: 3600, // Tempo di scadenza del link in secondi
    });
  }

  getExpiringDocuments(): void {
    this.documentService.getDocumentsExpiring().subscribe(
      (data) => {
        this.documents = data.data.sort((a, b) => {
          return new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime();
        });
      },
      (error) => {
        console.error('Error fetching documents', error);
      }
    );
  }
}
