import { z } from 'nestjs-zod/z'
import { Server, Socket } from 'socket.io'

export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  userId: z.string(),
  name: z.string(), // name of the user who sent the message
  likedUsers: z.string().array(),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>

export type ChatMsgLikesUpdated = Pick<ChatMessage, 'id' | 'likedUsers'>

// data or error, but not both
export type WsRes<T> =
  | {
      data: T
      error?: never
    }
  | {
      data?: never
      error: string
    }

type ServerEmit<T> = (res: WsRes<T>) => void

interface ServerToClientEvents {
  /**
   * Clients should listen to this event to receive error messages from the server
   */
  err: (msg: string) => void
  /**
   * Emits when a new post is created
   */
  posted: ServerEmit<ChatMessage>
  /**
   * Emits when a post is favorited
   */
  favorited: ServerEmit<ChatMsgLikesUpdated>
}

export type Ack<T> = (res: T) => void

export type ClientEmit<TData, TRes> = (
  clientEmitDto: TData,
  cb?: Ack<TRes>,
) => void

export const clientEmitDto = z.object({
  post: z.object({
    content: z.string().min(1),
  }),

  favorite: z.object({
    messageId: z.string(),
  }),

  echo: z.string(),
})

export type ClientEmitDto<K extends keyof typeof clientEmitDto.shape> = z.infer<
  typeof clientEmitDto.shape[K]
>

export interface T {
  echo: {
    res: WsRes<ClientEmitDto<'echo'>>
    emit: ClientEmit<ClientEmitDto<'echo'>, T['echo']['res']>
  }
  post: {
    res: Promise<WsRes<ChatMessage>> | WsRes<ChatMessage>
    emit: ClientEmit<ClientEmitDto<'post'>, WsRes<ChatMessage>>
  }
  favorite: {
    res: WsRes<ChatMsgLikesUpdated>
    emit: ClientEmit<ClientEmitDto<'favorite'>, T['favorite']['res']>
  }
  initialData: {
    res: WsRes<ChatMessage[]>
    emit: (cb?: Ack<T['initialData']['res']>) => void
  }
}

interface ClientToServerEvents {
  echo: T['echo']['emit']
  post: T['post']['emit']
  favorite: T['favorite']['emit']
  initialData: T['initialData']['emit']
}

export type ClientToServerEventNames = keyof ClientToServerEvents

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InterServerEvents {}

interface SocketData {
  userId: string | undefined
  activityId: string | undefined
}

export type ChatSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>

export type ChatServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
