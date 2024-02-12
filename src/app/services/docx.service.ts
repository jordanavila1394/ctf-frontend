// docx.service.ts
import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    HeadingLevel,
    VerticalAlign,
} from 'docx';

@Injectable({
    providedIn: 'root',
})
export class DocxService {
    constructor() {}

    createDocx(values: { [key: string]: string }, nameFile: string): void {
        // Create a table
        const table = new Table({
            rows: [
                ...Object.keys(values).map(
                    (key) =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph(key)],
                                }),
                                new TableCell({
                                    children: [new Paragraph(values[key])],
                                }),
                            ],
                        }),
                ),
            ],
        });

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: 'SCHEDA ASSUNZIONE',
                            heading: HeadingLevel.HEADING_1,
                        }
                        ),
                        table,
                    ],
                },
            ],
        });

        // Pack the document and save
        Packer.toBlob(doc).then((blob) => {
            fs.saveAs(blob, nameFile+'.docx');
        });
    }
}
