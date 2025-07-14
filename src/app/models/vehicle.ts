export interface VehicleInfo {
    tipology?: string;               // Tipologia veicolo
    licensePlate?: string;           // Targa
    model?: string;                  // Modello veicolo
    rentalType?: string;             // Tipo di noleggio

    user?: {
        name?: string;                 // Nome autista
        surname?: string;              // Cognome autista
        fiscalCode?: string;           // Codice fiscale autista
        workerNumber?: string;         // Matricola autista
    };

    company?: {
        name?: string;                 // Nome azienda
        vat?: string;                  // Partita IVA
        registeredOffice?: string;     // Sede legale
    };

    mileage?: number;                // Chilometraggio
    lastMaintenanceDate?: string;   // Data ultimo intervento (ISO string)
    nextMaintenanceDue?: string;    // Data prossima manutenzione (ISO string)
    engineHealth?: string;           // Stato salute motore
    batteryVoltage?: number;         // Voltaggio batteria (volt)
    oilLevel?: string;               // Livello olio

    tirePressureFL?: number;         // Pressione pneumatico anteriore sinistro (psi)
    tirePressureFR?: number;         // Pressione pneumatico anteriore destro (psi)
    tirePressureRL?: number;         // Pressione pneumatico posteriore sinistro (psi)
    tirePressureRR?: number;         // Pressione pneumatico posteriore destro (psi)

    gpsLatitude?: number;            // Latitudine GPS
    gpsLongitude?: number;           // Longitudine GPS
    speed?: number;                  // Velocità attuale (km/h)
    isEngineOn?: boolean;            // Motore acceso o no

    alertCode?: string;              // Codice allarme
    lastSync?: string;               // Data ultima sincronizzazione (ISO string)
}
