import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyState } from '../../../stores/dropdown-select-company/dropdown-select-company.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { setCompany } from '../../../stores/dropdown-select-company/dropdown-select-company.actions';

@Component({
    selector: 'app-dropdown-select-company',
    templateUrl: './dropdown-select-company.component.html',
})
export class DropdownSelectCompanyComponent {
    selectedCompany;
    companies;
    languagesOptions = [];

    companyState$: Observable<CompanyState>;

    constructor(
        public companyService: CompanyService,
        public primengConfig: PrimeNGConfig,
        private store: Store<{ companyState: CompanyState }>,
    ) {
        this.companyState$ = store.select('companyState');

        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies;
            this.companies.unshift({ id: 0, name: 'Tutte le aziende' });
        });
    }

    onChangeOption(event) {
        console.log(event.value);
        this.store.dispatch(setCompany({ currentCompany: event.value }));
    }
}
