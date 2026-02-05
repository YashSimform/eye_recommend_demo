import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as SentryNode from '@sentry/node';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { ENV } from './common/constants';
import cookieParser = require('cookie-parser');

const configureSwagger = (app: INestApplication): void => {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Backend Service')
    .setDescription('Backend Service APIs')
    // Add Bearer auth so you can use the Authorize button in Swagger UI
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  // Require the bearer auth globally in the docs (shows lock icon on endpoints)
  document.security = [{ 'access-token': [] }];

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Backend Service',
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      displayOperationId: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      filter: true,
    },
  });
};

const bootstrap = async (): Promise<void> => {
  const nestLogger: Logger = new Logger();

  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  // Enable cookie parsing
  app.use(cookieParser());

  // setup cors
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    optionsSuccessStatus: HttpStatus.OK,
    credentials: true,
  });

  // setup helmet
  app.use(helmet());

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // set global prefix
  app.setGlobalPrefix('api');

  // setup api versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // swagger setup
  if (configService.get<string>('app.env') !== ENV.PRODUCTION) {
    configureSwagger(app);
  }

  // sentry setup
  const dsn = configService.get<string | null>('app.sentryDsn');
  const env = configService.get<string>('app.env');
  if (dsn && env !== ENV.LOCAL) {
    // Initialize Sentry (node client). The project's Sentry NestJS wrapper isn't used here to
    // avoid incompatible exports; capturing exceptions will still work via Sentry's global client.
    SentryNode.init({ dsn, tracesSampleRate: 1.0, environment: env });
  }

  const port = configService.get<number>('app.port') ?? '3000';

  await app.listen(port, () => {
    nestLogger.log(`🚀 Service running on port ${port}`);
  });
};

void bootstrap();
