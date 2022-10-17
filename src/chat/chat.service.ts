import { Injectable } from '@nestjs/common'

import {
  ChatServer,
  ChatSocket,
  ClientEmitDto,
  clientEmitDto,
  T,
} from './socket.type'

@Injectable()
export class ChatService {
  favorite(data: any): T['favorite']['res'] {
    const result = parseDto(data, 'favorite')
    if (!result.success) {
      return { error: result.error }
    }

    // TODO
    return {
      data: {
        id: 'id',
        content: 'content',
        createdAt: new Date().toISOString(),
        likes: 1,
      },
    }
  }

  post(data: { content: string }): T['post']['res'] {
    const result = parseDto(data, 'post')
    if (!result.success) {
      return { error: result.error }
    }

    // TODO
    return {
      data: {
        id: 'id',
        content: result.parsed.content,
        createdAt: new Date().toISOString(),
        likes: 0,
      },
    }
  }

  echo(data: string): T['echo']['res'] {
    const result = parseDto(data, 'echo')
    if (!result.success) {
      return { error: result.error }
    }

    return { data: result.parsed }
  }

  setServer(server: ChatServer) {
    this.server = server
  }

  handleConnection(client: ChatSocket) {
    const { userId, activityId } = client.handshake.query

    if (typeof userId !== 'string' || typeof activityId !== 'string') {
      this.server
        .to(client.id)
        .emit(
          'err',
          'Send userId as query parameter when establishing connection, like this, io("...", { query: { userId: "userId", activityId: "activityId" }})',
        )
      client.disconnect()
      return
    }

    client.data.userId = userId
    client.data.activityId = activityId
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
