import { NgModule } from '@angular/core';
import {
    PathLocationStrategy,
    LocationStrategy,
    registerLocaleData,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { ProductService } from './services/product.service';
import { CountryService } from './services/country.service';
import { CustomerService } from './services/customer.service';
import { EventService } from './services/event.service';
import { IconService } from './services/icon.service';
import { NodeService } from './services/node.service';
import { PhotoService } from './services/photo.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
//Store
import { reducers, metaReducers } from './stores/global.reducers';
import { effects } from './stores/global.effects';

//Ngrx Store
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//Environment
import { environment } from '../environments/environment';
//Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    HttpClientModule,
    HTTP_INTERCEPTORS,
    HttpClient,
} from '@angular/common/http';

//Modules
import { CompanyModule } from './pages/company/company.module';
import { AuthModule } from './pages/auth/auth.module';
import { AttendanceModule } from './pages/attendance/attendance.module';

//Interceptor
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { HttpRequestInterceptor } from './helpers/http.interceptor';

//Ngx Gp Autocomplete
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultAutocompleteModule } from './shared/components/default-autocomplete/default-autocomplete.module';

//TranslateLoader
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

//Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DrodownLanguageModule } from './shared/components/dropdown-language/dropdown-language.module';

import localeIt from '@angular/common/locales/it';
import { VehicleModule } from './pages/vehicle/vehicle.module';
import { HomeModule } from './pages/home/home.module';
import { ImagesDialogModule } from './shared/components/imagesDialog/images-dialog.module';

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        NgxGpAutocompleteModule,
        FormsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        AppLayoutModule,
        ToastModule,
        AuthModule,
        CompanyModule,
        AttendanceModule,
        VehicleModule,
        HomeModule,
        DefaultAutocompleteModule,
        DrodownLanguageModule,
        ImagesDialogModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreDevtoolsModule.instrument({
            logOnly: environment.production,
            autoPause: true,
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        EffectsModule.forRoot(effects),
    ],
    providers: [
        {
            provide: Loader,
            useValue: new Loader({
                apiKey: environment.googleMapsApiKey,
                libraries: ['places', 'maps'],
            }),
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptor,
            multi: true,
        },

        { provide: LocationStrategy, useClass: PathLocationStrategy },
        MessageService,
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        registerLocaleData(localeIt, 'it');
        registerLocaleData(localeIt, 'es');
        registerLocaleData(localeIt, 'en');
    }
}
