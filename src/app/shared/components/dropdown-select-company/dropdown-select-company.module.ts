import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DropdownSelectCompanyComponent } from './dropdown-select-company.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [DropdownSelectCompanyComponent],
    imports: [BrowserModule, HttpClientModule, FormsModule, DropdownModule],
    providers: [],
    exports: [DropdownSelectCompanyComponent],
})
export class DropdownSelectCompanyModule {}
