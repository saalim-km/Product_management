import { inject, injectable } from "tsyringe";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constant";
import { RegisterUserInput } from "../../domain/interfaces/usecase/types/auth.types";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import { IUser } from "../../domain/models/user";
import { IUserRepository } from "../../domain/interfaces/repository/user.repository";
import { IRegisterUsecase } from "../../domain/interfaces/usecase/auth-usecase.interface";

@injectable()
export class RegisterUsecase implements IRegisterUsecase {
  constructor(
    @inject("IEmailExistenceUsecase")
    private _emailExistence: IEmailExistenceUsecase,
    @inject("IBcryptService") private _bcryptService: IBcryptService,
    @inject("IUserRepository") private _userRepo: IUserRepository
  ) {}

  async register(input: RegisterUserInput): Promise<void> {
    const userExists = await this._emailExistence.doesEmailExist(input.email);
    if (userExists.success) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const { name, email, password } = input;

    if (!password) {
      throw new CustomError(
        ERROR_MESSAGES.PASSWORD_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await this._bcryptService.hash(password);

    const data: Partial<IUser> = {
      name,
      email,
      password: hashedPassword,
    };

    const newClient = await this._userRepo.create(data);
  }
}
