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

type Ack<T> = (res: WsRes<T>) => void

interface ClientToServerEvents {
  echo: <T = string>(msg: T, cb: Ack<T>) => void
}

export type ClientToServerEventNames = keyof ClientToServerEvents

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InterServerEvents {}

interface SocketData {
  userId: string | undefined
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
