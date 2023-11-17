import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DropdownLanguageComponent } from './dropdown-language.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [DropdownLanguageComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        DropdownModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [],
    exports: [DropdownLanguageComponent],
})
export class DrodownLanguageModule {}
