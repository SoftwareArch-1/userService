// All message/event patterns
// These must be synced across the gateway and the chat service

export enum MessagePatFromGateway {
  Favorite,
  Post,
  GetAllByActivityId,
}

export enum EventPatToGateway {
  Favorite,
  Post,
}
