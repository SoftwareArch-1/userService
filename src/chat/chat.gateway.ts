import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'

import { ChatService } from './chat.service'
import { ChatServer, ChatSocket, ClientToServerEventNames } from './socket.type'

@WebSocketGateway({
  cors: true,
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  handleDisconnect(client: ChatSocket) {
    this.chatService.handleDisconnect(client)
  }

  afterInit(server: ChatServer) {
    this.chatService.setServer(server)
  }

  handleConnection(client: ChatSocket) {
    this.chatService.handleConnection(client)
  }

  @SubscribeMessage<ClientToServerEventNames>('post')
  post(@MessageBody() data: any, @ConnectedSocket() socket: ChatSocket) {
    return this.chatService.post(data, socket.data.activityId as string)
  }

  @SubscribeMessage<ClientToServerEventNames>('favorite')
  favorite(@MessageBody() data: any, @ConnectedSocket() socket: ChatSocket) {
    return this.chatService.favorite(data, socket.data.activityId as string)
  }

  @SubscribeMessage<ClientToServerEventNames>('echo')
  echo(@MessageBody() data: string) {
    return this.chatService.echo(data)
  }
}
