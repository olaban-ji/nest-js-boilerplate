import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './http-client.service';

@Module({
  imports: [HttpModule],
  providers: [HttpClientService, Logger],
  exports: [HttpClientService],
})
export class HttpClientModule {}
