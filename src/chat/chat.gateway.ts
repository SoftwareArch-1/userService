import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'

import { ChatService } from './chat.service'
import {
  ChatServer,
  ChatSocket,
  ClientToServerEventNames,
  T,
} from './socket.type'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(private readonly chatService: ChatService) {}

  afterInit(server: ChatServer) {
    this.chatService.setServer(server)
  }

  handleConnection(client: ChatSocket) {
    const { userId, activityId } = client.handshake.query

    if (typeof userId !== 'string' || typeof activityId !== 'string') {
      this.chatService.error(
        'Send userId as query parameter when establishing connection, like this, io("...", { query: { userId: "userId", activityId: "activityId" }})',
      )
      client.disconnect()
      return
    }

    client.data.userId = userId
    client.data.activityId = activityId
  }

  @SubscribeMessage<ClientToServerEventNames>('echo')
  echo(@MessageBody() data: string) {
    return this.chatService.echo(data)
  }
}
