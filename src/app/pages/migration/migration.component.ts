import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
    MigrationService,
    MigrationDebugData,
    BulkUpdateResult,
} from 'src/app/services/migration.service';
import { ClientService } from 'src/app/services/client.service';
import { BranchService } from 'src/app/services/branch.service';
import { Client } from 'src/app/models/client';
import { Branch } from 'src/app/models/branch';

@Component({
    templateUrl: './migration.component.html',
    providers: [MessageService, ConfirmationService],
})
export class MigrationComponent implements OnInit {
    debugData: MigrationDebugData | null = null;
    bulkUpdateResult: BulkUpdateResult | null = null;
    loading: boolean = false;
    updateInProgress: boolean = false;

    // Bulk update form
    bulkUpdateType: 'client' | 'branch' = 'client';
    selectedFromId: number | null = null;
    selectedToId: number | null = null;

    // Dropdowns data
    clients: Client[] = [];
    branches: Branch[] = [];

    constructor(
        private migrationService: MigrationService,
        private clientService: ClientService,
        private branchService: BranchService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadDebugData();
        this.loadClients();
        this.loadBranches();
    }

    loadDebugData() {
        this.loading = true;
        this.migrationService.debugMigrationData().subscribe({
            next: (data) => {
                this.debugData = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore nel caricamento dei dati di debug',
                });
                this.loading = false;
            },
        });
    }

    loadClients() {
        this.clientService.getAllClients().subscribe({
            next: (clients) => {
                this.clients = clients;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore nel caricamento dei clienti',
                });
            },
        });
    }

    loadBranches() {
        this.branchService.getAllBranches().subscribe({
            next: (branches) => {
                this.branches = branches;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: 'Errore nel caricamento delle filiali',
                });
            },
        });
    }

    confirmBulkUpdate() {
        if (!this.selectedFromId || !this.selectedToId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attenzione',
                detail: 'Seleziona entrambi i valori da sostituire',
            });
            return;
        }

        if (this.selectedFromId === this.selectedToId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attenzione',
                detail: 'I due valori devono essere diversi',
            });
            return;
        }

        const fromName = this.bulkUpdateType === 'client' 
            ? this.clients.find(c => c.id === this.selectedFromId)?.name
            : this.branches.find(b => b.id === this.selectedFromId)?.name;

        const toName = this.bulkUpdateType === 'client'
            ? this.clients.find(c => c.id === this.selectedToId)?.name
            : this.branches.find(b => b.id === this.selectedToId)?.name;

        this.confirmationService.confirm({
            message: `Sei sicuro di voler cambiare tutti gli utenti da "${fromName}" a "${toName}"? Questa operazione modificherà i dati nel database.`,
            header: 'Conferma Aggiornamento Massivo',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.runBulkUpdate();
            },
        });
    }

    runBulkUpdate() {
        if (!this.selectedFromId || !this.selectedToId) return;

        this.updateInProgress = true;
        this.bulkUpdateResult = null;

        this.migrationService
            .bulkUpdateClientBranch({
                type: this.bulkUpdateType,
                fromId: this.selectedFromId,
                toId: this.selectedToId,
            })
            .subscribe({
                next: (result) => {
                    this.bulkUpdateResult = result;
                    this.updateInProgress = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successo',
                        detail: result.message,
                    });
                    // Reset form
                    this.selectedFromId = null;
                    this.selectedToId = null;
                    // Ricarica i dati di debug
                    this.loadDebugData();
                },
                error: (err) => {
                    this.updateInProgress = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Errore',
                        detail: err.error?.message || 'Errore durante l\'aggiornamento massivo',
                    });
                },
            });
    }

    getSeverity(recommendation: string): string {
        if (recommendation.startsWith('✅')) return 'success';
        if (recommendation.startsWith('⚠️')) return 'warn';
        if (recommendation.startsWith('✓')) return 'info';
        if (recommendation.startsWith('🔄')) return 'warn';
        return 'info';
    }
}
