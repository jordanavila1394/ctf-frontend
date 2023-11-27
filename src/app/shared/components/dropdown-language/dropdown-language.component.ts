import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-dropdown-language',
    templateUrl: './dropdown-language.component.html',
})
export class DropdownLanguageComponent {
    selectedLanguage = { label: 'it', name: 'it', value: 'it', code: 'it' };
    cities;
    languagesOptions = [];

    constructor(
        public translateService: TranslateService,
        public primengConfig: PrimeNGConfig,
    ) {}
    ngOnInit(): void {
        for (const language of this.translateService.getLangs()) {
            this.languagesOptions.push({
                label: language,
                name: language.toUpperCase(),
                value: language,
                code: language === 'en' ? 'uk' : language,
            });
        }
        this.selectedLanguage = {
            label: 'it',
            name: 'IT',
            value: 'it',
            code: 'it',
        };
    }

    onChangeOption(event) {
        this.translateService.use(event.value.value);
        this.translateService
            .get('primeng')
            .subscribe((res) => this.primengConfig.setTranslation(res));
    }
}
