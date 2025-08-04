import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, {
    logger: ['error'],
    errorHandler: (err) => {
      console.error(err);
      process.exit(1);
    },
  });
}

bootstrap();
