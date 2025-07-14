import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.scss']
})
export class ChatAiComponent {
  isOpen = false;
  newMessage = '';
  messages: { sender: 'user' | 'ai'; text: string }[] = [];

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

    if (message) {
      // Aggiunge il messaggio dell'utente
      this.messages.push({ sender: 'user', text: message });

      // Pulisce l'input
      this.newMessage = '';

      // Risposta dell'AI con un piccolo ritardo per realismo
      setTimeout(() => {
        const response = this.generateResponse(message);
        this.messages.push({ sender: 'ai', text: response });
      }, 500);
    }
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
  
  
}
