import { IUser } from "../../domain/models/user";

export class Mapper {
  static userMapper(user: IUser): { _id: string; name: string; email: string } {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
