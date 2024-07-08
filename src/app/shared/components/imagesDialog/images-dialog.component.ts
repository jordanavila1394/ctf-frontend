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
    fullscreenImage: string | null = null;

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
            Expires: 3600, // Tempo di scadenza del link in secondi
        });
    }

    selectedImage: string | null = null;

    openFullscreen(imageUrl: string) {
        const fullscreenOverlay = document.getElementById('fullscreen-overlay');
        const fullscreenImage = document.getElementById(
            'fullscreen-image',
        ) as HTMLImageElement;

        if (fullscreenOverlay && fullscreenImage) {
            fullscreenImage.src = imageUrl;
            fullscreenOverlay.style.display = 'flex';
        }
    }

    closeFullscreen() {
        const fullscreenOverlay = document.getElementById('fullscreen-overlay');
        if (fullscreenOverlay) {
            fullscreenOverlay.style.display = 'none';
        }
    }
}
