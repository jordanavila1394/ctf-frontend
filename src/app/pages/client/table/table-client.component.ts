import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client';
import { ROUTES } from 'src/app/utils/constants';

@Component({
    templateUrl: './table-client.component.html',
    providers: [MessageService, ConfirmationService],
})
export class TableClientComponent implements OnInit {
    clients: Client[] = [];
    loading: boolean = true;
    actionsFrozen: boolean = false;
    selectedClient: Client;

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
                this.goToModifyClient(this.selectedClient.id);
            },
        },
        {
            label: 'Elimina',
            icon: 'pi pi-trash',
            command: () => {
                this.confirmErase(this.selectedClient.id);
            },
        },
    ];

    constructor(
        private router: Router,
        private clientService: ClientService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public translateService: TranslateService
    ) {}

    ngOnInit() {
        this.loadClients();
    }

    loadClients() {
        this.loading = true;
        this.clientService.getAllClients().subscribe({
            next: (data) => {
                console.log('Risposta backend clienti:', data);
                this.clients = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore nel caricamento dei clienti',
                });
                this.loading = false;
            },
        });
    }

    goToCreateClient() {
        this.router.navigate([ROUTES.ROUTE_CREATE_CLIENT]);
    }

    goToModifyClient(id: number) {
        this.router.navigate([ROUTES.ROUTE_MODIFY_CLIENT], {
            queryParams: { id: id },
        });
    }

    confirmErase(id: number) {
        this.confirmationService.confirm({
            message: 'Sei sicuro di voler eliminare questo cliente?',
            header: 'Conferma eliminazione',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteClient(id);
            },
        });
    }

    deleteClient(id: number) {
        this.clientService.deleteClient(id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successo',
                    detail: 'Cliente eliminato con successo',
                });
                this.loadClients();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore durante eliminazione del cliente',
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
            const worksheet = xlsx.utils.json_to_sheet(this.clients);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'clienti');
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
