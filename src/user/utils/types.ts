/**
 * Omit properties that are actually in the prototype of the given type.
 */
export type SafeOmit<T, K extends keyof T> = Omit<T, K>

/**
 * Make some of the Properties in a type Optional
 * @see https://bobbyhadz.com/blog/typescript-make-some-properties-optional#make-some-of-the-properties-in-a-type-optional-in-typescript
 */
export type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>
