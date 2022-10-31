import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { queueNames } from './synced-configs'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL as string],
          queue: queueNames.fromGateway,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
