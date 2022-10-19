import * as cookieParser from 'cookie-parser'
import { patchNestJsSwagger } from 'nestjs-zod'

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

patchNestJsSwagger()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('🤩🤩 User service + API gateway 😎👌')
    .setDescription('The user service API and gateway description')
    .setVersion('69,420 🤪')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: true,
  })

  await app.listen(4000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
