import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { ProductService } from './shared/service/product.service';
import { CountryService } from './shared/service/country.service';
import { CustomerService } from './shared/service/customer.service';
import { EventService } from './shared/service/event.service';
import { IconService } from './shared/service/icon.service';
import { NodeService } from './shared/service/node.service';
import { PhotoService } from './shared/service/photo.service';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
