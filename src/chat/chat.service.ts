import { toArray } from 'rxjs/operators'
import { catchError, map, Observable, of } from 'rxjs'

import { Inject, Injectable } from '@nestjs/common'

import { MessagePatFromGateway } from './messages'
import {
  ChatServer,
  ChatSocket,
  ClientEmitDto,
  clientEmitDto,
  T,
  WsRes,
} from './socket.type'

import type { ClientRMQ } from '@nestjs/microservices'
type ObservableOr<T> = T | Observable<T>

@Injectable()
export class ChatService {
  constructor(@Inject('CHAT_SERVICE') private readonly client: ClientRMQ) {}

  favorite(data: any): ObservableOr<T['favorite']['res']> {
    const result = parseDto(data, 'favorite')
    if (!result.success) {
      return { error: result.error }
    }

    return this.client.send(MessagePatFromGateway.Favorite, result.parsed).pipe(
      map((res) => {
        // TODO map res to T['favorite']['res']
        return {
          data: {
            id: 'id',
            content: 'content',
            createdAt: new Date().toISOString(),
            likes: 1,
          },
        }
      }),
      catchError((error) => {
        return of({ error })
      }),
    )
  }

  post(data: { content: string }): ObservableOr<T['post']['res']> {
    const result = parseDto(data, 'post')
    if (!result.success) {
      return { error: result.error }
    }

    return this.client.send(MessagePatFromGateway.Post, result.parsed).pipe(
      map((res) => {
        // TODO map res to T['post']['res']
        return {
          data: {
            id: 'id',
            content: 'content',
            createdAt: new Date().toISOString(),
            likes: 0,
          },
        }
      }),
      catchError((error) => {
        return of({ error })
      }),
    )
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

    // room name is the activityId
    client.join(activityId)

    // TODO: remove this once we have a response from the call to chat service
    this.server.to(activityId).emit('initialData', {
      data: [
        {
          id: Math.random().toString(),
          content: 'content' + Math.random(),
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          likes: Math.floor(Math.random() * 100),
        },
        {
          id: Math.random().toString(),
          content: 'content' + Math.random(),
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          likes: Math.floor(Math.random() * 100),
        },
        {
          id: Math.random().toString(),
          content: 'content' + Math.random(),
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          likes: Math.floor(Math.random() * 100),
        },
        {
          id: Math.random().toString(),
          content: 'content' + Math.random(),
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          likes: Math.floor(Math.random() * 100),
        },
      ],
    })

    this.client.send(MessagePatFromGateway.GetAllByActivityId, activityId).pipe(
      map<
        any,
        {
          id: string
          content: string
          createdAt: string
          likes: number
        }
      >((res) => {
        // TODO map res
        return {
          id: Math.random().toString(),
          content: 'content' + Math.random(),
          createdAt: new Date().toISOString(),
          likes: Math.floor(Math.random() * 100),
        }
      }),
      toArray(),
      map((data) => {
        this.server.to(activityId).emit('initialData', { data })
      }),
    )
  }

  handleDisconnect(client: ChatSocket) {
    client.data.activityId && client.leave(client.data.activityId)
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
