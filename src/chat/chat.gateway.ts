import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'

import { ChatService } from './chat.service'
import { WsRes } from './dto/base'

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('echo')
  echo(@MessageBody() data: string): WsRes<typeof data> {
    return this.chatService.echo(data)
  }
}
