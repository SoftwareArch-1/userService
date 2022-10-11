import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { ActivityController } from './activity.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ACTIVITY_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [ActivityController],
})
export class ActivityModule {}
