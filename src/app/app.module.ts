import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
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
import { AuthModule } from './pages/auth/auth.module';
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

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        AppLayoutModule,
        ToastModule,
        AuthModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreDevtoolsModule.instrument({
            logOnly: environment.production,
            autoPause: true,
        }),
        EffectsModule.forRoot(effects),
    ],
    providers: [
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
export class AppModule {}
