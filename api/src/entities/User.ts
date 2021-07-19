export default class User {
  public readonly id?: string;
  public readonly email: string;
  public readonly password: string;
  public readonly username: string;
  public readonly firstName: string;
  public readonly lastName?: string;
  public readonly isActive: boolean = false;
  public readonly modifiedAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    email,
    password,
    username,
    firstName,
    lastName,
    isActive,
    modifiedAt,
    createdAt
  }: {
    id?: string;
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName?: string;
    isActive?: boolean;
    modifiedAt?: Date;
    createdAt?: Date;
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = isActive || this.isActive;

    const now = new Date();
    this.createdAt = createdAt || now;
    this.modifiedAt = modifiedAt || now;
  }

  update = ({
    email,
    password,
    username,
    firstName,
    lastName,
    isActive
  }: {
    email?: string;
    password?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
  }) =>
    new User({
      id: this.id,
      createdAt: this.createdAt,
      email: email || this.email,
      password: password || this.password,
      username: username || this.username,
      firstName: firstName || this.firstName,
      lastName: lastName || this.lastName,
      isActive
    });
}
