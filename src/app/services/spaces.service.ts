// src/app/spaces.service.ts

import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SpacesService {
    public spacesEndpoint = new AWS.Endpoint(environment.spacesEndpoint);
    public bucketName = 'ctf.images';

    public s3 = new AWS.S3({
        endpoint: this.spacesEndpoint,
        accessKeyId: environment.accessKeyId,
        secretAccessKey: environment.secretAccessKey,
    });

    listObjects(): Promise<AWS.S3.ListObjectsOutput> {
        return this.s3.listObjects({ Bucket: this.bucketName }).promise();
    }

    getDocumentUrl(key: string): string {
        const url = this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: 3600 // URL expires in 1 hour (3600 seconds)
        });
        return url;
    }
}
