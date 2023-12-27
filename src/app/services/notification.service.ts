import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private socket = io('http://localhost:3000');

    joinRoom(userId: string) {
        this.socket.emit('join-room', userId);
    }

    sendMessage(data: any) {
        this.socket.emit('private-message', data);
    }

    receiveMessage(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('private-message', (message: any) => {
                observer.next(message);
            });
        });
    }
}
