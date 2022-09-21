import { User } from '@prisma/client'
import { SafeOmit } from './types'

export const stripPassword = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user
  return rest
}
