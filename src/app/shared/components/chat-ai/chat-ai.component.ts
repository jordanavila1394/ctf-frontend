import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatAiComponent {
  isOpen = false;
  newMessage = '';
  messages: Array<{ sender: string; text: string }> = [];

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;


  private readonly storageKey = 'chatAiMessages';
  private readonly expiryKey = 'chatAiExpiry';
  private readonly ttl = 1000 * 60 * 60 * 24 * 30; // 30 giorni

  constructor(private vehicleService: VehicleService,) {
    this.loadMessages();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({
        sender: 'ai',
        text: 'Ciao! Sono il tuo assistente AI 😊'
      });
      this.saveMessages();

    }
    this.scrollToBottom();

  }


  sendMessage() {
    const message = this.newMessage?.trim();
    if (!message) return;

    this.messages.push({ sender: 'user', text: message });
    this.newMessage = '';
    this.saveMessages();

    this.scrollToBottom();

    // gestione risposte AI o comandi
    if (this.handleCommands(message)) return;

    setTimeout(() => {
      const response = this.generateResponse(message);
      this.messages.push({ sender: 'ai', text: response });
      this.saveMessages();
      this.scrollToBottom();
    }, 500);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Errore nello scroll automatico:', err);
      }
    }, 50);
  }

  private saveMessages() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
    localStorage.setItem(this.expiryKey, Date.now().toString());
  }

  private loadMessages() {
    const stored = localStorage.getItem(this.storageKey);
    const expiry = localStorage.getItem(this.expiryKey);

    if (stored && expiry) {
      const expired = Date.now() - parseInt(expiry, 10) > this.ttl;
      if (!expired) {
        const parsed = JSON.parse(stored) as Array<{ sender: string; text: string }>;
        // Ora sanitize solo in memoria, quando serve
        this.messages = parsed;
      } else {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.expiryKey);
      }
    }
  }

  private handleCommands(message: string): boolean {
    const addAiMessage = (text: string) => {
      this.messages.push({ sender: 'ai', text });
      this.saveMessages();
      this.scrollToBottom();
    };

    if (message.toLowerCase().trim() === 'aiuto' || message.toLowerCase().trim() === 'help') {
      const helpText = `
  Comandi disponibili:<br/>
  - <b>info targa [targa]</b>: Dati veicolo, conducente e azienda.<br/>
  - <b>status targa [targa]</b>: Stato generale del veicolo (condizioni, allarmi, ecc.).<br/>
  - <b>quadro targa [targa]</b>: Velocità, livello benzina e stato motore.<br/>
  - <b>gomme targa [targa]</b>: Stato pneumatici.<br/>
  - <b>mappa targa [targa]</b>: Mostra posizione veicolo.<br/>
  - <b>aiuto</b>: Mostra questo elenco.
`;

      this.messages.push({ sender: 'ai', text: helpText });
      this.saveMessages();
      this.scrollToBottom();
      return true;  // comando gestito, non proseguire con altri
    }

    const infoMatch = message.match(/^info targa\s+(.+)$/i);
    if (infoMatch) {
      const plate = infoMatch[1].trim();
      if (!plate) {
        addAiMessage('Per favore inserisci una targa dopo "info targa".');
        return true;
      }

      addAiMessage(`Sto cercando le informazioni per la targa "${plate}"...`);

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          const infoText = this.formatVehicleInfo(data);
          addAiMessage(infoText);
        },
        error: () => {
          addAiMessage('Spiacente, non sono riuscito a trovare informazioni per questa targa.');
        }
      });

      return true;
    }

    const statusMatch = message.match(/^status targa\s+(.+)$/i);
    if (statusMatch) {
      const plate = statusMatch[1].trim();
      if (!plate) {
        addAiMessage('Per favore inserisci una targa dopo "status targa".');
        return true;
      }

      addAiMessage(`Verifico lo stato per la targa "${plate}"...`);

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          const statusText = this.formatVehicleStatus(data);
          addAiMessage(statusText);
        },
        error: () => {
          addAiMessage('Spiacente, non sono riuscito a recuperare lo stato per questa targa.');
        }
      });

      return true;
    }
    //qui
    const quadroMatch = message.match(/^quadro targa\s+(.+)$/i);
    if (quadroMatch) {
      const plate = quadroMatch[1].trim();
      if (!plate) {
        addAiMessage('Per favore inserisci una targa dopo "quadro targa".');
        return true;
      }

      addAiMessage(`Verifico il quadro informazioni per la targa "${plate}"...`);

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          const quadroText = this.formatVehicleDashboard(data);
          addAiMessage(quadroText);
        },
        error: () => {
          addAiMessage('Spiacente, non sono riuscito a recuperare il quadro informazioni per questa targa.');
        }
      });

      return true;
    }

    const tiresMatch = message.match(/^gomme targa\s+(.+)$/i);
    if (tiresMatch) {
      const plate = tiresMatch[1].trim();
      if (!plate) {
        addAiMessage('Per favore inserisci una targa dopo "tires targa".');
        return true;
      }

      addAiMessage(`Recupero lo stato delle gomme per la targa "${plate}"...`);

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          const tiresText = this.formatTireStatus(data);
          addAiMessage(tiresText);
        },
        error: () => {
          addAiMessage('Errore nel recupero delle informazioni sulle gomme per questa targa.');
        }
      });

      return true;
    }

    const mapMatch = message.match(/^mappa targa\s+(.+)$/i);
    if (mapMatch) {
      const plate = mapMatch[1].trim();
      if (!plate) {
        addAiMessage('Per favore inserisci una targa dopo "map targa".');
        return true;
      }

      addAiMessage(`Recupero la posizione per la targa "${plate}"...`);

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          this.formatMapVehicle(data).then((mapText) => {
            addAiMessage(mapText);
          });
        },
        error: () => {
          addAiMessage('Errore nel recupero delle informazioni sulla posizione.');
        }
      });

      return true;
    }

    return false;
  }


  generateResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('ciao')) {
      return 'Ciao anche a te!';
    }

    if (lower.includes('buona notte')) {
      return 'È ora di dormire 💤';
    }

    if (lower.includes('come stai')) {
      return 'Sto bene, grazie! E tu?';
    }

    return 'Interessante! Raccontami di più.';
  }

  private formatVehicleInfo(data: any): string {
    if (!data || Object.keys(data).length === 0) {
      return '<p class="no-info">Nessuna informazione disponibile.</p>';
    }

    return `
      <table class="vehicle-info-table">
        <thead>
          <tr><th>Campo</th><th>Informazione</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Tipologia</strong></td><td>${data.tipology || 'N/D'}</td></tr>
          <tr><td><strong>Targa</strong></td><td>${data.licensePlate || 'N/D'}</td></tr>
          <tr><td><strong>Modello</strong></td><td>${data.model || 'N/D'}</td></tr>
          <tr><td><strong>Tipo Noleggio</strong></td><td>${data.rentalType || 'N/D'}</td></tr>
          <tr><td><strong>Autista</strong></td><td>${data.user?.name || ''} ${data.user?.surname || ''}</td></tr>
          <tr><td><strong>Codice Fiscale</strong></td><td>${data.user?.fiscalCode || 'N/D'}</td></tr>
          <tr><td><strong>Matricola</strong></td><td>${data.user?.workerNumber || 'N/D'}</td></tr>
          <tr><td><strong>Azienda</strong></td><td>${data.company?.name || 'N/D'}</td></tr>
          <tr><td><strong>Partita IVA</strong></td><td>${data.company?.vat || 'N/D'}</td></tr>
          <tr><td><strong>Sede Legale</strong></td><td>${data.company?.registeredOffice || 'N/D'}</td></tr>
        </tbody>
      </table>
    `;
  }

  private formatVehicleStatus(data: any): string {
    if (!data || Object.keys(data).length === 0) {
      return '<p class="no-info">Nessuna informazione di stato disponibile.</p>';
    }

    return `
      <table class="vehicle-status-table">
        <thead>
          <tr><th>Parametro</th><th>Valore</th></tr>
        </thead>
        <tbody>
          <tr><td>Chilometraggio</td><td>${data.mileage ?? 'N/D'} km</td></tr>
          <tr><td>Ultimo intervento</td><td>${data.lastMaintenanceDate ? new Date(data.lastMaintenanceDate).toLocaleDateString() : 'N/D'}</td></tr>
          <tr><td>Prossima manutenzione</td><td>${data.nextMaintenanceDue ? new Date(data.nextMaintenanceDue).toLocaleDateString() : 'N/D'}</td></tr>
          <tr><td>Salute motore</td><td>${data.engineHealth || 'N/D'}</td></tr>
          <tr><td>Voltaggio batteria</td><td>${data.batteryVoltage ?? 'N/D'} V</td></tr>
          <tr><td>Livello olio</td><td>${data.oilLevel ?? 'N/D'}</td></tr>
          <tr><td>Pressione pneumatico anteriore sinistro</td><td>${data.tirePressureFL ?? 'N/D'} psi</td></tr>
          <tr><td>Pressione pneumatico anteriore destro</td><td>${data.tirePressureFR ?? 'N/D'} psi</td></tr>
          <tr><td>Pressione pneumatico posteriore sinistro</td><td>${data.tirePressureRL ?? 'N/D'} psi</td></tr>
          <tr><td>Pressione pneumatico posteriore destro</td><td>${data.tirePressureRR ?? 'N/D'} psi</td></tr>
          <tr><td>Latitudine GPS</td><td>${data.gpsLatitude ?? 'N/D'}</td></tr>
          <tr><td>Longitudine GPS</td><td>${data.gpsLongitude ?? 'N/D'}</td></tr>
          <tr><td>Velocità attuale</td><td>${data.speed ?? 'N/D'} km/h</td></tr>
          <tr><td>Motore acceso</td><td>${data.isEngineOn ? 'Sì' : 'No'}</td></tr>
          <tr><td>Codice allarme</td><td>${data.alertCode || 'N/D'}</td></tr>
          <tr><td>Ultima sincronizzazione</td><td>${data.lastSync ? new Date(data.lastSync).toLocaleString() : 'N/D'}</td></tr>
        </tbody>
      </table>
    `;
  }


  private roundDownToNearest10(value: number): number {
    return Math.floor(value / 10) * 10;
  }

  private formatVehicleDashboard(data: any): string {
    if (!data || Object.keys(data).length === 0) {
      return '<p class="no-info">Nessuna informazione di stato disponibile.</p>';
    }

    const oilLevelRaw = typeof data.oilLevel === 'number' ? Math.min(100, Math.max(0, data.oilLevel)) : 0;
    const oilLevel = this.roundDownToNearest10(oilLevelRaw);

    const engineHealthClassMap: Record<string, string> = {
      ottimo: 'ottimo',
      buono: 'buono',
      cattivo: 'cattivo',
    };
    const engineHealthClass = engineHealthClassMap[data.engineHealth?.toLowerCase()] || 'unknown';

    return `
      <div class="vehicle-dashboard">
        <div class="speed-display">
          <div class="value">
            <i class="pi pi-tachometer"></i> ${data.speed ?? 'N/D'}<span class="unit"> km/h</span>
          </div>
          <div class="label">Velocità</div>
        </div>
  
        <div class="fuel-display">
          <div class="label">
            <i class="pi pi-drop"></i> Carburante
          </div>
          <div class="fuel-bar">
            <div class="fuel-fill level-${oilLevel}" style="width: ${oilLevel}%"></div>
          </div>
          <div class="fuel-value">${oilLevelRaw}%</div>
        </div>
  
        <div class="engine-status ${data.isEngineOn ? 'on' : 'off'}">
          <span class="engine-icon">
            <i class="pi pi-cog"></i>
          </span>
          <span class="engine-text">${data.isEngineOn ? 'Motore acceso' : 'Motore spento'}</span>
        </div>
  
        <div class="engine-health ${engineHealthClass}">
          <i class="pi pi-heart"></i>
          ${data.engineHealth ? data.engineHealth.charAt(0).toUpperCase() + data.engineHealth.slice(1) : 'N/D'}
        </div>
  
        <div class="battery-voltage">
          <div class="label">
            <i class="pi pi-bolt"></i> Tensione Batteria
          </div>
          <div class="value">${data.batteryVoltage ?? 'N/D'} V</div>
        </div>
      </div>
    `;
  }



  private formatTireStatus(data: any): string {
    if (!data || Object.keys(data).length === 0) {
      return '<p class="no-info">Nessuna informazione di stato disponibile.</p>';
    }

    return `
      <div class="tire-pressure-diagram">
        <div class="tire top-left">${data.tirePressureFL ?? 'N/D'} PSI</div>
        <div class="tire top-right">${data.tirePressureFR ?? 'N/D'} PSI</div>
        <img src="/assets/chat/vehicle_top_view.png" alt="Car Top View" class="car-diagram" />
        <div class="tire bottom-left">${data.tirePressureRL ?? 'N/D'} PSI</div>
        <div class="tire bottom-right">${data.tirePressureRR ?? 'N/D'} PSI</div>
      </div>
    `;
  }

  formatMapVehicle(data: any): Promise<string> {
    return new Promise((resolve) => {
      if (!data.gpsLatitude || !data.gpsLongitude) {
        return resolve('<p class="no-info">Coordinate GPS non disponibili.</p>');
      }

      const lat = parseFloat(data.gpsLatitude);
      const lng = parseFloat(data.gpsLongitude);
      const latLng = { lat, lng };
      const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;

          resolve(`
            <div class="vehicle-map-info">
              <p><strong>Indirizzo:</strong> ${address}</p>
              <p><strong>Coordinate:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
              <p><a href="${mapsLink}" target="_blank">Visualizza su Google Maps</a></p>
              <iframe
                width="100%"
                height="250"
                frameborder="0"
                style="border:0; border-radius: 8px;"
                src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${lat},${lng}&zoom=15"
                allowfullscreen>
              </iframe>
            </div>
          `);
        } else {
          resolve(`
            <div class="vehicle-map-info">
              <p class="no-info">Indirizzo non disponibile per queste coordinate.</p>
              <p><strong>Coordinate:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
              <p><a href="${mapsLink}" target="_blank">Visualizza su Google Maps</a></p>
              <iframe
                width="100%"
                height="250"
                frameborder="0"
                style="border:0; border-radius: 8px;"
                src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${lat},${lng}&zoom=15"
                allowfullscreen>
              </iframe>
            </div>
          `);
        }
      });
    });
  }

}
