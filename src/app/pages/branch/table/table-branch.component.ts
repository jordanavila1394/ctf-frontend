import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { BranchService } from 'src/app/services/branch.service';
import { Branch } from 'src/app/models/branch';
import { ROUTES } from 'src/app/utils/constants';

@Component({
    templateUrl: './table-branch.component.html',
    providers: [MessageService, ConfirmationService],
})
export class TableBranchComponent implements OnInit {
    branches: Branch[] = [];
    loading: boolean = true;
    actionsFrozen: boolean = false;
    selectedBranch: Branch;

    sizes = [
        { name: 'Small', class: 'p-datatable-sm' },
        { name: 'Normal', class: '' },
        { name: 'Large', class: 'p-datatable-lg' },
    ];
    selectedSize: any = '';

    items = [
        {
            label: 'Modifica',
            icon: 'pi pi-pencil',
            command: () => {
                this.goToModifyBranch(this.selectedBranch.id);
            },
        },
        {
            label: 'Elimina',
            icon: 'pi pi-trash',
            command: () => {
                this.confirmErase(this.selectedBranch.id);
            },
        },
    ];

    constructor(
        private router: Router,
        private branchService: BranchService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public translateService: TranslateService
    ) {}

    ngOnInit() {
        this.loadBranches();
    }

    loadBranches() {
        this.loading = true;
        this.branchService.getAllBranches().subscribe({
            next: (data) => {
                console.log('Risposta backend filiali:', data);
                this.branches = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore nel caricamento delle filiali',
                });
                this.loading = false;
            },
        });
    }

    goToCreateBranch() {
        this.router.navigate([ROUTES.ROUTE_CREATE_BRANCH]);
    }

    goToModifyBranch(id: number) {
        this.router.navigate([ROUTES.ROUTE_MODIFY_BRANCH], {
            queryParams: { id: id },
        });
    }

    confirmErase(id: number) {
        this.confirmationService.confirm({
            message: 'Sei sicuro di voler eliminare questa filiale?',
            header: 'Conferma eliminazione',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteBranch(id);
            },
        });
    }

    deleteBranch(id: number) {
        this.branchService.deleteBranch(id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successo',
                    detail: 'Filiale eliminata con successo',
                });
                this.loadBranches();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore durante eliminazione della filiale',
                });
            },
        });
    }

    clear(table: any) {
        table.clear();
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.branches);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'filiali');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE =
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data: Blob = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });
                module.default.saveAs(
                    data,
                    fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
                );
            }
        });
    }
}
