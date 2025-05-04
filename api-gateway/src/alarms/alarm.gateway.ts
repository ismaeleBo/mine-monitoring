import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AlarmNotifierService } from './alarm-notifier.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AlarmGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notifier: AlarmNotifierService) {}

  afterInit(server: Server) {
    this.notifier.setSocketServer(server);
    console.log('[GATEWAY] WebSocket server initialized');
  }
}
