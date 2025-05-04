import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { AlarmResponseDto } from './dto/alarm-response.dto';

@Injectable()
export class AlarmNotifierService {
  private socketServer: Server | null = null;

  setSocketServer(server: Server) {
    this.socketServer = server;
  }

  emitAlarm(alarm: AlarmResponseDto) {
    if (!this.socketServer) {
      console.warn('[GATEWAY] WebSocket not initialized');
      return;
    }

    this.socketServer.emit('new-alarm', alarm);
    console.log('[GATEWAY] WebSocket Emitted:', alarm);
  }
}
