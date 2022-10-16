import { z } from 'nestjs-zod/z'

import { Injectable } from '@nestjs/common'

import { wsRes, WsRes } from './dto/base'

@Injectable()
export class ChatService {
  echo(data: string): WsRes<string> {
    if (z.string().safeParse(data).success) {
      return wsRes({ data })
    }
    return wsRes({ error: 'Message must be of type string' })
  }
}
