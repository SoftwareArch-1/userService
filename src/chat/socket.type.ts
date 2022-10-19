import { z } from 'nestjs-zod/z'
import { Server, Socket } from 'socket.io'

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
  initialData: ServerEmit<
    {
      id: string
      content: string
      createdAt: string
      likes: number
    }[]
  >
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
    res: WsRes<{
      id: string
      content: string
      createdAt: string
      likes: number
    }>
    emit: ClientEmit<ClientEmitDto<'post'>, T['post']['res']>
  }
  favorite: {
    res: WsRes<{
      id: string
      content: string
      createdAt: string
      likes: number
    }>
    emit: ClientEmit<ClientEmitDto<'favorite'>, T['favorite']['res']>
  }
}

interface ClientToServerEvents {
  echo: T['echo']['emit']
  post: T['post']['emit']
  favorite: T['favorite']['emit']
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
