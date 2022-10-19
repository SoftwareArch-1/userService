import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { queueNames } from './messages'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // TODO: move to env with the actual host. Where is the host of the rabbitmq server?
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
