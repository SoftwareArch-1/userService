import { z } from 'nestjs-zod/z'
import { catchError, map, Observable, of } from 'rxjs'
import { toArray } from 'rxjs/operators'

import { Inject, Injectable } from '@nestjs/common'

import {
  chatMessageSchema,
  ChatServer,
  ChatSocket,
  ClientEmitDto,
  clientEmitDto,
  T,
} from './socket.type'
import { MessagePatFromGateway } from './synced-configs'

import type { ClientRMQ } from '@nestjs/microservices'
import { prismaClient } from 'prisma/script'

type ObservableOr<T> = T | Observable<T>

const chatMsgSchemaFromChatService = chatMessageSchema
  .omit({
    name: true,
  })
  .extend({
    activityId: z.string(),
  })

type ChatMsgFromChatService = z.infer<typeof chatMsgSchemaFromChatService>

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_SERVICE_CLIENT') private readonly client: ClientRMQ,
  ) {}

  favorite(data: any, activityId: string): ObservableOr<T['favorite']['res']> {
    const result = parseDto(data, 'favorite')
    if (!result.success) {
      return { error: result.error }
    }

    return this.client.send(MessagePatFromGateway.Favorite, result.parsed).pipe(
      map((res) => {
        const parsed = chatMsgSchemaFromChatService
          .pick({ id: true, likes: true })
          .parse(res)
        const r: T['favorite']['res'] = {
          data: parsed,
        }
        this.server.to(activityId).emit('favorited', r)
        return r
      }),
      catchError((error) => {
        return of({ error })
      }),
    )
  }

  post(
    data: { content: string },
    activityId: string,
    userId: string,
  ): ObservableOr<T['post']['res']> {
    const result = parseDto(data, 'post')
    if (!result.success) {
      return { error: result.error }
    }

    type PostPayload = {
      userId: string
      content: string
      activityId: string
    }

    return this.client
      .send<ChatMsgFromChatService, PostPayload>(MessagePatFromGateway.Post, {
        activityId,
        userId,
        content: result.parsed.content,
      })
      .pipe(
        map(async (res) => {
          console.log('>>> | res', res)
          // TODO map res to T['post']['res']
          const user = await prismaClient.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              name: true,
            },
          })

          if (!user) {
            throw `User with id ${userId} not found`
          }

          const r: T['post']['res'] = {
            data: {
              id: res.id,
              content: res.content,
              createdAt: res.createdAt,
              likes: res.likes,
              userId: res.userId,
              name: user.name,
            },
          }
          this.server.to(activityId).emit('posted', r)
          return r
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

    this.client
      .send<ChatMsgFromChatService>(
        MessagePatFromGateway.GetAllByActivityId,
        activityId,
      )
      .pipe(
        toArray(),
        map(async (data) => {
          chatMsgSchemaFromChatService.array().parse(data)

          const userIds = data.map((d) => d.userId)
          const users = await prismaClient.user.findMany({
            where: {
              id: {
                in: userIds,
              },
            },
            select: {
              name: true,
              id: true,
            },
          })
          this.server.to(activityId).emit('initialData', {
            data: data.map((d) => {
              const user = users.find((u) => u.id === d.userId)
              return {
                ...d,
                name: user?.name as string,
              }
            }),
          })
        }),
        catchError((error) => {
          this.server.to(activityId).emit('initialData', {
            error,
          })
          return of({
            error,
          })
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
