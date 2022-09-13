import { UserT } from '../entities/user.entity'
import { SafeOmit } from './types'

export const stripPassword = (user: UserT): SafeOmit<UserT, 'password'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user
  return rest
}
