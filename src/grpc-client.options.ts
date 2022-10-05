import { ClientOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'sync_with_activity', // ['hero', 'hero2']
    protoPath: join(__dirname, './sync_with_activity/activity.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
  },
}
