import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/services/client.service';
import { ROUTES } from 'src/app/utils/constants';

@Component({
    templateUrl: './create-client.component.html',
    providers: [MessageService],
})
export class CreateClientComponent implements OnInit {
    createForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
    });

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private clientService: ClientService,
        private messageService: MessageService
    ) {}

    ngOnInit() {}

    onSubmit(): void {
        if (this.createForm.valid) {
            const name = this.createForm.value.name?.trim() || '';

            this.clientService.createClient(name).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successo',
                        detail: 'Cliente creato con successo',
                    });
                    this.router.navigate([ROUTES.ROUTE_TABLE_CLIENT]);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Errore',
                        detail: 'Errore durante la creazione del cliente',
                    });
                },
            });
        }
    }

    goBack() {
        this.router.navigate([ROUTES.ROUTE_TABLE_CLIENT]);
    }
}
