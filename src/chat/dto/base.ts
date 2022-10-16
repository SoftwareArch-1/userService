// data xor error
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
