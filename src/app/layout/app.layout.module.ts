import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppLayoutComponent } from './app.layout.component';
import { DrodownLanguageModule } from '../shared/components/dropdown-language/dropdown-language.module';
import { DropdownSelectCompanyModule } from '../shared/components/dropdown-select-company/dropdown-select-company.module';
import { GeoModalPermissionModule } from '../shared/components/geo-modal-permission/geo-moda-permission.module';
import { DropdownNotificationsModule } from '../shared/components/dropdown-notifications/dropdown-notifications.module';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        DropdownSelectCompanyModule,
        DropdownNotificationsModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        DrodownLanguageModule,
        GeoModalPermissionModule,
        AppConfigModule,
    ],
    exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
