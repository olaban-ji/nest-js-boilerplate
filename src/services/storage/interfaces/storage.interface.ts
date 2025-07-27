import { UploadApiResponse } from 'cloudinary';
import { MemoryStoredFile } from 'nestjs-form-data';
import {
  HttpRequestMethodEnum,
  UploadFileCategoryEnum,
} from 'src/common/enums';
import { S3PutObjectResponse } from '../types/s3-put-object-response';

export interface IStrorageService {
  upload(
    file: MemoryStoredFile,
    fileCategory: UploadFileCategoryEnum,
  ): Promise<UploadApiResponse | S3PutObjectResponse>;

  createPresignedUrlWithoutClient?(
    key: string,
    method?: HttpRequestMethodEnum,
    ttl?: number,
  ): Promise<string>;
}
