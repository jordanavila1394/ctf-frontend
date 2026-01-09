import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/services/branch.service';
import { ROUTES } from 'src/app/utils/constants';

@Component({
    templateUrl: './modify-branch.component.html',
    providers: [MessageService],
})
export class ModifyBranchComponent implements OnInit {
    branchId: number;

    modifyForm = this.fb.group({
        id: ['', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(2)]],
    });

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private branchService: BranchService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.branchId = +params['id'];
            this.loadBranch();
        });
    }

    loadBranch() {
        this.branchService.getBranch(this.branchId).subscribe({
            next: (branch) => {
                this.modifyForm.patchValue({
                    id: branch.id?.toString(),
                    name: branch.name,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore nel caricamento della filiale',
                });
            },
        });
    }

    onSubmit(): void {
        if (this.modifyForm.valid) {
            const name = this.modifyForm.value.name?.trim().toUpperCase() || '';

            this.branchService.updateBranch(this.branchId, name).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successo',
                        detail: 'Filiale modificata con successo',
                    });
                    this.router.navigate([ROUTES.ROUTE_TABLE_BRANCH]);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Errore',
                        detail: 'Errore durante la modifica della filiale',
                    });
                },
            });
        }
    }

    goBack() {
        this.router.navigate([ROUTES.ROUTE_TABLE_BRANCH]);
    }
}
