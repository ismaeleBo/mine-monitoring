import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlarmResponseDto } from './dto/alarm-response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AlarmGateway {
  @WebSocketServer()
  server: Server;

  @MessagePattern('alarm_created')
  handleAlarmCreated(@Payload() alarm: AlarmResponseDto) {
    this.server.emit('new-alarm', alarm);
  }
}
