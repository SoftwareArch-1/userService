import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { queueNames } from './messages'

export const chatConsumerConfig: MicroserviceOptions = {
  options: {
    urls: ['amqp://localhost:5672'],
    queue: queueNames.toGateway,
    queueOptions: {
      durable: false,
    },
  },
  transport: Transport.RMQ,
}
