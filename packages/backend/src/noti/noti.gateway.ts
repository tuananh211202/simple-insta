import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
})
export class NotiGateway {
  @WebSocketServer() server: Server;

  private clientsInfo: { userId: number; clientId: string }[] = [];

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    const index = this.clientsInfo.findIndex((cl) => cl.clientId === client.id);
    if (index !== -1) this.clientsInfo.splice(index, 1);
  }

  @SubscribeMessage('connectServer')
  handleSubmitInfo(client: any, userId: number): void {
    this.clientsInfo.push({ userId, clientId: client.id });

    this.server
      .to(client.id)
      .emit('connectStatus', { message: 'Connect successfully' });
  }

  @SubscribeMessage('sendUserId')
  handleSendNotification(client: any, userId: number): void {
    // Gửi noti ve client.id để cap nhat tinh trang
    const receiverClient = this.clientsInfo.find(
      (record) => record.userId === userId,
    );
    const sendUserId = this.clientsInfo.find(
      (record) => record.clientId === client.id,
    );
    if (receiverClient) {
      this.server
        .to(receiverClient.clientId)
        .emit('receiveUserId', sendUserId.userId);
    } else console.log(`Client ${userId} is not connect`);
  }
}
