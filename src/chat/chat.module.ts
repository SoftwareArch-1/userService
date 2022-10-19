import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // TODO: move to env with the actual host. Where is the host of the rabbitmq server?
          queue: 'chat',
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
