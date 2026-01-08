import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/services/branch.service';
import { ROUTES } from 'src/app/utils/constants';

@Component({
    templateUrl: './create-branch.component.html',
    providers: [MessageService],
})
export class CreateBranchComponent implements OnInit {
    createForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
    });

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private branchService: BranchService,
        private messageService: MessageService
    ) {}

    ngOnInit() {}

    onSubmit(): void {
        if (this.createForm.valid) {
            const name = this.createForm.value.name?.trim().toUpperCase() || '';

            this.branchService.createBranch(name).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successo',
                        detail: 'Filiale creata con successo',
                    });
                    this.router.navigate([ROUTES.ROUTE_TABLE_BRANCH]);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Errore',
                        detail: 'Errore durante la creazione della filiale',
                    });
                },
            });
        }
    }

    goBack() {
        this.router.navigate([ROUTES.ROUTE_TABLE_BRANCH]);
    }
}
