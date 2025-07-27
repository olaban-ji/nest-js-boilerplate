import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import http from 'http';
import https from 'https';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  private readonly httpAgent = new http.Agent({ keepAlive: false });
  private readonly httpsAgent = new https.Agent({ keepAlive: false });

  constructor(
    private readonly httpService: HttpService,
    @Inject(Logger) private readonly loggerService: LoggerService,
  ) {
    this.httpService.axiosRef.defaults.httpAgent = this.httpAgent;
    this.httpService.axiosRef.defaults.httpsAgent = this.httpsAgent;
  }

  async makeHttpRequest(
    url: string,
    options: AxiosRequestConfig,
  ): Promise<any> {
    this.loggerService.log(
      `Making HTTP request to ${url}`,
      HttpClientService.name,
    );

    const data =
      (await lastValueFrom(this.httpService.request({ url, ...options }))) ||
      {};

    this.loggerService.log(
      `HTTP request to ${url} successful`,
      HttpClientService.name,
    );

    return data;
  }
}
