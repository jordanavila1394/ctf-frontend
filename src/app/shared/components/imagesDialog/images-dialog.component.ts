import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SpacesService } from 'src/app/services/spaces.service';

@Component({
    selector: 'app-images-dialog',
    templateUrl: './images-dialog.component.html',
    styleUrls: ['./images-dialog.component.scss'],
})
export class ImagesDialogComponent {
    images: AWS.S3.Object[];
    files: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private spacesService: SpacesService,
    ) {
        this.files = this.config.data;
    }

    getImageUrl(key: string): string {
        return this.spacesService.s3.getSignedUrl('getObject', {
            Bucket: this.spacesService.bucketName,
            Key: key,
            Expires: 60, // Tempo di scadenza del link in secondi
        });
    }
}
