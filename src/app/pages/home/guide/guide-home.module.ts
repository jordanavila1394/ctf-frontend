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

import { GuideHomeComponent } from './guide-home.component';
import { GuideHomeRoutingModule } from './guide-home-routing.module';

@NgModule({
    imports: [
        CommonModule,
        GuideHomeRoutingModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        TranslateModule,
    ],
    declarations: [GuideHomeComponent],
})
export class GuideHomeModule {}
