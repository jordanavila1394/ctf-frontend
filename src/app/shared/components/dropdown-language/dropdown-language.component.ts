import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-dropdown-language',
    templateUrl: './dropdown-language.component.html',
})
export class DropdownLanguageComponent implements OnInit {
    selectedLanguage: any;
    languagesOptions = [];

    constructor(
        public translateService: TranslateService,
        public primengConfig: PrimeNGConfig
    ) { }

    ngOnInit(): void {
        const savedLang = localStorage.getItem('selectedLanguage') || 'it';

        for (const language of this.translateService.getLangs()) {
            const option = {
                label: language,
                name: language.toUpperCase(),
                value: language,
                code: language === 'en' ? 'uk' : language,
            };
            this.languagesOptions.push(option);

            // Imposta il selezionato se combacia col localStorage
            if (language === savedLang) {
                this.selectedLanguage = option;
            }
        }

        // Se non è stato trovato (fallback)
        if (!this.selectedLanguage) {
            this.selectedLanguage = {
                label: 'it',
                name: 'IT',
                value: 'it',
                code: 'it',
            };
        }
    }

    onChangeOption(event) {
        const lang = event.value.value || event.value; // Supporta vari formati
        this.translateService.use(lang);
        localStorage.setItem('selectedLanguage', lang); // Salva nel localStorage
        this.translateService
            .get('primeng')
            .subscribe((res) => this.primengConfig.setTranslation(res));
    }
}
