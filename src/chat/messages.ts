// All message/event patterns
// These must be synced across the gateway and the chat service

export const queueNames = {
  fromGateway: 'from_gateway', // gateway producer (client), chat service consumer (microservice)
  toGateway: 'to_gateway', // gateway consumer (microservice), chat service producer (client)
} as const

export enum MessagePatFromGateway {
  Favorite,
  Post,
  GetAllByActivityId,
}

export enum EventPatToGateway {
  Favorite,
  Post,
}
