import { inject, injectable } from "tsyringe";
import { IEmailExistenceUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { CustomError } from "../../shared/utils/helper/custom-error";
import { IEmailCheckResult } from "../../domain/interfaces/usecase/types/common.types";
import type { IUserRepository } from "../../domain/interfaces/repository/user.repository";
import { IUser } from "../../domain/models/user";
import { ERROR_MESSAGES } from "../../shared/constants/constant";

@injectable()
export class EmailExistenceUsecase implements IEmailExistenceUsecase {
  constructor(
    @inject("IUserRepository") private _userRepo: IUserRepository
  ) {}

  async doesEmailExist(email: string): Promise<IEmailCheckResult<IUser>> {
    if (!email) {
      throw new CustomError(ERROR_MESSAGES.INVALID_DATAS, 400);
    }

    const user = await this._userRepo.findOne({email : email});

    return {
      success: !!user,
      data: user,
    };
  }
}