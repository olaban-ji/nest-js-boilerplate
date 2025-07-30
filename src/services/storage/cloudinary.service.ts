import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import toStream = require('buffer-to-stream');
import { IStrorageService } from './interfaces/storage.interface';
import { UploadFileCategoryEnum } from '@common/enums';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class CloudinaryService implements IStrorageService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Logger) private readonly loggerService: LoggerService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('cloudinary.cloudName'),
      api_key: this.configService.getOrThrow<string>('cloudinary.apiKey'),
      api_secret: this.configService.getOrThrow<string>('cloudinary.apiSecret'),
    });
  }

  async upload(
    file: MemoryStoredFile,
    fileCategory: UploadFileCategoryEnum,
  ): Promise<UploadApiResponse> {
    this.loggerService.log(
      `Starting upload: filename="${file.originalName}", size=${file.size} bytes, category=${fileCategory}`,
      CloudinaryService.name,
    );

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `${this.configService.getOrThrow<string>('cloudinary.folder')}/${fileCategory}`,
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            this.loggerService.error(
              `Upload failed: filename="${file.originalName}", error=${error.message}`,
              error.stack,
              CloudinaryService.name,
            );
            return reject(error);
          }

          this.loggerService.log(
            `Upload successful: filename="${file.originalName}", public_id=${result.public_id}, url=${result.secure_url}`,
            CloudinaryService.name,
          );
          return resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
