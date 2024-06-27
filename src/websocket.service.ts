import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { NotificacaoResponse } from './interfaces/NotificacaoResponse';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messages: NotificacaoResponse[] = [];
  private wsUrl = 'http://localhost:8081/notificacao';

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl)
    });
  }

  connect( clientId: string, username: string, onNotificationReceived: (notification: NotificacaoResponse) => void) {
    this.client.onConnect = () => {

      this.client.subscribe(`/topic/notifications/${clientId}/${username}`, (message: Message) => {
        
        const notification: NotificacaoResponse = JSON.parse(message.body);
        console.log('Parsed notification:', notification);

        this.messages.push(notification);

        onNotificationReceived(notification);
      });
    };

    // Tratamento de erros no WebSocket
    this.client.onStompError = (frame) => {
      console.error('WebSocket broker error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    };

    // Ativação da conexão WebSocket
    this.client.activate();
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
      console.log('Disconnected from WebSocket');
    }
  }

  getMessages(): NotificacaoResponse[] {
    return this.messages;
  }

  sendMessage(message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish({ destination: '/app/notifications', body: JSON.stringify(message) });
      resolve();
    });
  }
  
}