import { z } from 'nestjs-zod/z'

import { Injectable } from '@nestjs/common'

import { ChatServer, ClientEmitDto, clientEmitDto, T } from './socket.type'

@Injectable()
export class ChatService {
  favorite(data: any): T['favorite']['res'] {
    const result = parseDto(data, 'favorite')
    if (!result.success) {
      return { error: result.error }
    }

    // TODO
    return {
      data: 'favorite todo',
    }
  }

  post(data: { content: string }) {
    const result = parseDto(data, 'post')
    if (!result.success) {
      return { error: result.error }
    }

    // TODO
    return {
      data: 'post todo',
    }
  }

  echo(data: string): T['echo']['res'] {
    const result = parseDto(data, 'echo')
    if (!result.success) {
      return { error: result.error }
    }

    return { data: result.parsed }
  }

  error(msg: string) {
    this.server.emit('error', msg)
  }

  setServer(server: ChatServer) {
    this.server = server
  }

  private server: ChatServer
}

const parseDto = <K extends keyof typeof clientEmitDto.shape>(
  data: any,
  kind: K,
):
  | {
      parsed: ClientEmitDto<K>
      success: true
    }
  | {
      success: false
      error: string
    } => {
  const result = clientEmitDto.shape[kind].safeParse(data)
  if (result.success) {
    return { parsed: result.data, success: true }
  }
  return { error: JSON.stringify(result.error), success: false }
}
