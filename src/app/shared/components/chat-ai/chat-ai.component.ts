import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.scss'],
  encapsulation: ViewEncapsulation.None })
export class ChatAiComponent {
  isOpen = false;
  newMessage = '';
  messages: { sender: 'user' | 'ai'; text: string }[] = [];

  constructor(private vehicleService: VehicleService) { }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({
        sender: 'ai',
        text: 'Ciao! Sono il tuo assistente AI 😊',
      });
    }
  }

  sendMessage() {
    const message = this.newMessage.trim();
    if (!message) return;

    this.messages.push({ sender: 'user', text: message });
    this.newMessage = '';

    if (this.handleCommands(message)) return;

    setTimeout(() => {
      const response = this.generateResponse(message);
      this.messages.push({ sender: 'ai', text: response });
    }, 500);
  }

  private handleCommands(message: string): boolean {
    const infoMatch = message.match(/^info targa\s+(.+)$/i);
    if (infoMatch) {
      const plate = infoMatch[1].trim();
      if (!plate) {
        this.messages.push({ sender: 'ai', text: 'Per favore inserisci una targa dopo "info targa".' });
        return true;
      }

      this.messages.push({ sender: 'ai', text: `Sto cercando le informazioni per la targa "${plate}"...` });

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          const infoText = this.formatVehicleInfo(data);
          this.messages.push({ sender: 'ai', text: infoText });
        },
        error: () => {
          this.messages.push({ sender: 'ai', text: 'Spiacente, non sono riuscito a trovare informazioni per questa targa.' });
        }
      });

      return true;
    }

    const statusMatch = message.match(/^status targa\s+(.+)$/i);
    if (statusMatch) {
      const plate = statusMatch[1].trim();
      if (!plate) {
        this.messages.push({ sender: 'ai', text: 'Per favore inserisci una targa dopo "status targa".' });
        return true;
      }

      this.messages.push({ sender: 'ai', text: `Verifico lo stato per la targa "${plate}"...` });

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          const statusText = this.formatVehicleStatus(data);
          this.messages.push({ sender: 'ai', text: statusText });
        },
        error: () => {
          this.messages.push({ sender: 'ai', text: 'Spiacente, non sono riuscito a recuperare lo stato per questa targa.' });
        }
      });

      return true;
    }

    const tiresMatch = message.match(/^tires targa\s+(.+)$/i);
    if (tiresMatch) {
      const plate = tiresMatch[1].trim();
      if (!plate) {
        this.messages.push({ sender: 'ai', text: 'Per favore inserisci una targa dopo "tires targa".' });
        return true;
      }

      this.messages.push({ sender: 'ai', text: `Recupero lo stato delle gomme per la targa "${plate}"...` });

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          const tiresText = this.formatTireStatus(data);
          this.messages.push({ sender: 'ai', text: tiresText });
        },
        error: () => {
          this.messages.push({ sender: 'ai', text: 'Errore nel recupero delle informazioni sulle gomme per questa targa.' });
        }
      });

      return true;
    }

    const mapMatch = message.match(/^map targa\s+(.+)$/i);
    if (mapMatch) {
      const plate = mapMatch[1].trim();
      if (!plate) {
        this.messages.push({ sender: 'ai', text: 'Per favore inserisci una targa dopo "map targa".' });
        return true;
      }

      this.messages.push({ sender: 'ai', text: `Recupero la posizione per la targa "${plate}"...` });

      this.vehicleService.getVehicleInfo(plate).subscribe({
        next: (data) => {
          this.formatMapVehicle(data).then((tiresText) => {
            this.messages.push({ sender: 'ai', text: tiresText });
          });
        },
        error: () => {
          this.messages.push({ sender: 'ai', text: 'Errore nel recupero delle informazioni sulla posizione.' });
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
