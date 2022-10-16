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

export const wsRes = <T>(res: WsRes<T>) => res

interface ServerToClientEvents {
  /**
   * Clients should listen to this event to receive error messages from the server
   */
  error: (msg: string) => void
}

export type Ack<T> = (res: T) => void

export type ClientEmit<TData, TRes> = (data: TData, cb?: Ack<TRes>) => void

export interface T<
  EchoT = string,
  EchoRes = WsRes<EchoT>,
  PostRes = WsRes<string>,
> {
  echo: {
    res: EchoRes
    emit: ClientEmit<EchoT, EchoRes>
  }
  post: {
    res: PostRes
    emit: ClientEmit<{ content: string }, PostRes>
  }
}

interface ClientToServerEvents {
  echo: T['echo']['emit']
  post: T['post']['emit']
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
