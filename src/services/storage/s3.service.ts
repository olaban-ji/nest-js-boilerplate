import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStrorageService } from './interfaces/storage.interface';
import {
  HttpRequestMethodEnum,
  UploadFileCategoryEnum,
} from 'src/common/enums';
import { MemoryStoredFile } from 'nestjs-form-data';
import { InjectS3, S3 } from 'nestjs-s3';
import { customAlphabet } from 'nanoid';
import { hexadecimalLowercase } from 'nanoid-dictionary';
import { S3PutObjectResponse } from './types/s3-put-object-response';
import { parseUrl } from '@smithy/url-parser';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { fromEnv } from '@aws-sdk/credential-providers';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { formatUrl } from '@aws-sdk/util-format-url';

@Injectable()
export class S3Service implements IStrorageService {
  private s3Bucket: string;
  private s3Region: string;
  private readonly nanoid = customAlphabet(hexadecimalLowercase, 10);

  constructor(
    private readonly configService: ConfigService,
    @Inject(Logger) private readonly loggerService: LoggerService,
    @InjectS3() private readonly s3Client: S3,
  ) {
    this.s3Bucket = this.configService.getOrThrow<string>('aws.s3.bucket');
    this.s3Region = this.configService.getOrThrow<string>('aws.s3.region');
  }

  async upload(
    file: MemoryStoredFile,
    fileCategory: UploadFileCategoryEnum,
  ): Promise<S3PutObjectResponse> {
    this.s3Bucket = this.configService.getOrThrow<string>('aws.s3.bucket');

    const key = `${fileCategory}/${this.nanoid()}_${file.originalName}`;

    this.loggerService.log(
      `Starting upload: filename="${file.originalName}", size=${file.size} bytes, category=${fileCategory}`,
      S3Service.name,
    );

    await this.s3Client.putObject({
      Bucket: this.s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    const url = `https://${this.s3Bucket}.s3.${this.s3Region}.amazonaws.com/${key}`;

    this.loggerService.log(
      `Upload successful: filename="${file.originalName}", key=${key}`,
      S3Service.name,
    );

    return { key, url };
  }

  async createPresignedUrlWithoutClient(
    key: string,
    method?: HttpRequestMethodEnum,
    ttl?: number,
  ): Promise<string> {
    const httpMethod = method ?? HttpRequestMethodEnum.GET;
    const expiresIn = ttl ?? 30 * 60 * 60;

    const url = parseUrl(
      `https://${this.s3Bucket}.s3.${this.s3Region}.amazonaws.com/${key}`,
    );
    const presigner = new S3RequestPresigner({
      credentials: fromEnv(),
      region: this.s3Region,
      sha256: Hash.bind(null, 'sha256'),
    });

    const signedUrlObject = await presigner.presign(
      new HttpRequest({ ...url, method: httpMethod }),
      { expiresIn },
    );
    return formatUrl(signedUrlObject);
  }
}
