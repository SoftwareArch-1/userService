import { User } from '@prisma/client'
import { Response } from 'express'

export interface AuthenticatedResponse extends Response {
  user: User
}
