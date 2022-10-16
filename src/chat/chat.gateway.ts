import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'

import { ChatService } from './chat.service'
import { WsRes } from './dto/base'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const { userId } = client.handshake.query
    if (typeof userId !== 'string') {
      client.send(
        'Send userId as query parameter when establishing connection, like this, io("...", { query: { userId: "userId" }})',
      )
      client.disconnect()
      return
    }
    client.data.userId = userId
  }

  @SubscribeMessage('echo')
  echo(@MessageBody() data: string): WsRes<typeof data> {
    return this.chatService.echo(data)
  }
}
