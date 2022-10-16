import { z } from 'nestjs-zod/z'

import { Injectable } from '@nestjs/common'

import { ChatServer, T } from './socket.type'

@Injectable()
export class ChatService {
  private server: ChatServer

  setServer(server: ChatServer) {
    this.server = server
  }

  error(msg: string) {
    this.server.emit('error', msg)
  }

  echo(data: string): T['echo']['res'] {
    if (z.string().safeParse(data).success) {
      return { data }
    }
    return { error: 'Message must be of type string' }
  }
}
