export default abstract class Entity {
    protected constructor(public id: string, public createdAt: number, public updatedAt: number) {}
}

export type Payload<T> = T extends object
    ? {
          readonly [P in keyof T]: Payload<T[P]>;
      }
    : unknown;
