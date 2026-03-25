export class UserEntity {
  id!: string;
  name!: string;
  email!: string;
  createdAt!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
