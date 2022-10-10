import { patchNestJsSwagger } from 'nestjs-zod'

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

patchNestJsSwagger()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('🤩🤩 User service + API gateway 😎👌')
    .setDescription('The user service API and gateway description')
    .setVersion('69,420 🤪')
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
