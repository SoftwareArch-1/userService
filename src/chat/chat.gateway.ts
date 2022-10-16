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
  WsRes,
} from './socket.type'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(private readonly chatService: ChatService) {}

  afterInit(server: ChatServer) {
    this.chatService.setServer(server)
  }

  handleConnection(client: ChatSocket) {
    const { userId } = client.handshake.query
    if (typeof userId !== 'string') {
      this.chatService.error(
        'Send userId as query parameter when establishing connection, like this, io("...", { query: { userId: "userId" }})',
      )
      client.disconnect()
      return
    }
    client.data.userId = userId
  }

  @SubscribeMessage<ClientToServerEventNames>('echo')
  echo(@MessageBody() data: string): WsRes<typeof data> {
    return this.chatService.echo(data)
  }
}
