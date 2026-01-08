import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/services/client.service';
import { ROUTES } from 'src/app/utils/constants';

@Component({
    templateUrl: './modify-client.component.html',
    providers: [MessageService],
})
export class ModifyClientComponent implements OnInit {
    clientId: number;

    modifyForm = this.fb.group({
        id: ['', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(2)]],
    });

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private clientService: ClientService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.clientId = +params['id'];
            this.loadClient();
        });
    }

    loadClient() {
        this.clientService.getClient(this.clientId).subscribe({
            next: (client) => {
                this.modifyForm.patchValue({
                    id: client.id?.toString(),
                    name: client.name,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore nel caricamento del cliente',
                });
            },
        });
    }

    onSubmit(): void {
        if (this.modifyForm.valid) {
            const name = this.modifyForm.value.name?.trim() || '';

            this.clientService.updateClient(this.clientId, name).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successo',
                        detail: 'Cliente modificato con successo',
                    });
                    this.router.navigate([ROUTES.ROUTE_TABLE_CLIENT]);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Errore',
                        detail: 'Errore durante la modifica del cliente',
                    });
                },
            });
        }
    }

    goBack() {
        this.router.navigate([ROUTES.ROUTE_TABLE_CLIENT]);
    }
}
