import { Module, DynamicModule, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { STORAGE_PROVIDER } from 'src/common/constants';
import { StorageDriverEnum } from 'src/common/enums';
import { S3Service } from './s3.service';
import { getS3ConnectionToken, S3, S3Module } from 'nestjs-s3';

@Module({})
export class StorageModule {
  static register(): DynamicModule {
    return {
      module: StorageModule,
      imports: [
        S3Module.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            config: {
              credentials: {
                accessKeyId: configService.get<string>('aws.s3.accessKeyId'),
                secretAccessKey: configService.get<string>(
                  'aws.s3.secretAccessKey',
                ),
              },
              region: configService.get<string>('aws.s3.region'),
            },
          }),
        }),
      ],
      providers: [
        {
          provide: STORAGE_PROVIDER,
          useFactory: (
            configService: ConfigService,
            loggerService: LoggerService,
            s3Client: S3,
          ) => {
            const driver = configService.getOrThrow('driver.storage');
            if (driver === StorageDriverEnum.CLOUDINARY) {
              return new CloudinaryService(configService, loggerService);
            } else if (driver === StorageDriverEnum.S3) {
              return new S3Service(configService, loggerService, s3Client);
            }

            throw new Error(`Unsupported storage driver: ${driver}`);
          },
          inject: [ConfigService, Logger, getS3ConnectionToken('')],
        },
        Logger,
      ],
      exports: [STORAGE_PROVIDER],
    };
  }
}
