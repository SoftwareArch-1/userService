// All message/event patterns
// These must be synced across the gateway and the chat service

export const queueNames = {
  fromGateway: 'from_gateway', // gateway producer (client), chat service consumer (microservice)
} as const

export enum MessagePatFromGateway {
  Favorite,
  Post,
  GetAllByActivityId,
}
