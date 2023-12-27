import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TranslateModule } from '@ngx-translate/core';

import { DocumentsHomeComponent } from './documents-home.component';
import { DocumentsHomeRoutingModule } from './documents-home-routing.module';
import { PanelModule } from 'primeng/panel';

@NgModule({
    imports: [
        CommonModule,
        DocumentsHomeRoutingModule,
        PanelModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        TranslateModule,
    ],
    declarations: [DocumentsHomeComponent],
})
export class DocumentsHomeModule {}
