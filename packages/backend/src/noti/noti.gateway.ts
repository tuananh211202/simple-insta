import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotiService } from './noti.service';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
})
export class NotiGateway {
  constructor(
    private notiService: NotiService,
    private messageService: MessageService,
  ) {}

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

  @SubscribeMessage('getOnline')
  handleGetOnline(client: any): void {
    this.server.to(client.id).emit(
      'listOnline',
      this.clientsInfo.map((client) => client.userId),
    );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: any,
    payload: { userId: number; message: string },
  ) {
    const receiverClient = this.clientsInfo.find(
      (record) => record.userId === payload.userId,
    );
    const sendUser = this.clientsInfo.find(
      (record) => record.clientId === client.id,
    );

    await this.messageService.createMessage(
      sendUser.userId,
      payload.userId,
      payload.message,
    );

    this.server.to(client.id).emit('receiveMessage', {
      message: 'You send new messages!',
    });

    if (receiverClient)
      this.server.to(receiverClient.clientId).emit('receiveMessage', {
        message: 'You have new messages!',
      });
  }

  @SubscribeMessage('sendUserId')
  async handleSendNotification(client: any, userId: number) {
    const receiverClient = this.clientsInfo.find(
      (record) => record.userId === userId,
    );
    const sendUser = this.clientsInfo.find(
      (record) => record.clientId === client.id,
    );

    const request = await this.notiService.createRequest(
      sendUser.userId,
      userId,
    );

    if (receiverClient && request.message === 'Send') {
      this.server
        .to(receiverClient.clientId)
        .emit('receiveUserId', sendUser.userId);
    }
  }
}
