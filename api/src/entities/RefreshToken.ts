export default class RefreshToken {
  public readonly id?: string;
  public readonly userId: string;
  public readonly ttl: number;
  public readonly createdAt: Date;

  constructor({
    id,
    userId,
    ttl,
    createdAt
  }: {
    id?: string;
    userId: string;
    ttl: number;
    createdAt?: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.ttl = ttl;
    this.createdAt = createdAt || new Date();
  }

  isExpired() {
    return (
      new Date().getTime() - this.createdAt.getTime() > this.ttl * 1000 * 60
    );
  }
}
