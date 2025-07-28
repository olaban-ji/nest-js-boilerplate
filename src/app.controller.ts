import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './modules/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Welcome message for nest-js-boilerplate' })
  welcomeMessage(): { data: string } {
    return { data: 'Welcome to nest-js-boilerplate! :)' };
  }
}
