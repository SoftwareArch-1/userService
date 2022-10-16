import { z } from 'nestjs-zod/z'

import { Injectable } from '@nestjs/common'

import { ChatServer, WsRes, wsRes } from './socket.type'

@Injectable()
export class ChatService {
  private server: ChatServer

  setServer(server: ChatServer) {
    this.server = server
  }

  error(msg: string) {
    this.server.emit('error', msg)
  }

  echo(data: string): WsRes<string> {
    if (z.string().safeParse(data).success) {
      return wsRes({ data })
    }
    return wsRes({ error: 'Message must be of type string' })
  }
}
