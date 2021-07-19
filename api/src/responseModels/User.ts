export default class User {
  constructor(
    public readonly id?: string,
    public readonly email?: string,
    public readonly username?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly imgPath?: string,
    public readonly modifiedAt?: Date,
    public readonly createdAt?: Date
  ) {}
}
