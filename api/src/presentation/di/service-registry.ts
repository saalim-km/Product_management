import { container } from "tsyringe";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import { BcryptService } from "../../interfaceAdapters/services/bcrypt.service";
import { AwsS3Service } from "../../interfaceAdapters/services/aws.service";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { RedisService } from "../../interfaceAdapters/services/redis.service";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";
import { GetPresignedUrlUsecase } from "../../application/common/get-presigned-url.usecase";
import { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";
import { JwtService } from "../../interfaceAdapters/services/jwt.service";

export class ServiceRegistry {
  static registerServices(): void {

    container.register<IBcryptService>("IBcryptService", {
      useClass: BcryptService,
    });
    
    container.register<IRedisService>("IRedisService", {
      useClass: RedisService,
    });

    container.register<IAwsS3Service>("IAwsS3Service",{
      useClass : AwsS3Service
    })

    container.register<IGetPresignedUrlUsecase>('IGetPresignedUrlUsecase',{
      useClass : GetPresignedUrlUsecase 
    })

    container.register<IJwtservice>('IJwtservice',{
      useClass : JwtService
    })
  }
}
