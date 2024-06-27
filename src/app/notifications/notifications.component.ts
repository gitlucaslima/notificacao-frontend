import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificacaoResponse } from 'src/interfaces/NotificacaoResponse';
import { WebSocketService } from 'src/websocket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: NotificacaoResponse[] = [];
  newNotification: any = { // Define the newNotification object
    assunto: '',
    clientId: 'b0476d92-8343-4619-a2b2-ed5e4a6436e4',
    destinatarioUsername: '00000000040',
    remetenteUsername: '02705534288',
    descricao: ''
  };
  private websocketSubscription: Subscription | undefined; // Inscrição para o WebSocket
  sendingMessage: boolean = false; // Flag para indicar se está enviando uma mensagem

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    console.log('Component initialized');
    const clientId = 'b0476d92-8343-4619-a2b2-ed5e4a6436e4'; // Suponha que você tenha esses valores
    const username = '00000000040'; // Suponha que você tenha esses valores
    this.webSocketService.connect(clientId, username, (notification: NotificacaoResponse) => {
      this.notifications.push(notification);
    });
  }

  ngOnDestroy() {
    // Desinscreva-se ao destruir o componente para evitar vazamentos de memória
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  sendNotification() {
    // Verifica se já está enviando uma mensagem para evitar envios múltiplos
    if (this.sendingMessage) {
      return;
    }

    this.sendingMessage = true; // Marca que está enviando a mensagem

    this.webSocketService.sendMessage(this.newNotification)
      .then(() => {
        this.sendingMessage = false; // Marca que parou de enviar a mensagem
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
        this.sendingMessage = false; // Em caso de erro, também marca que parou de enviar a mensagem
      });
  }
}
