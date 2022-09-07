import { IdT } from 'src/entities/base.entity'
import type { UserT } from './entities/user.entity'

export const db: Map<IdT, UserT> = new Map()
