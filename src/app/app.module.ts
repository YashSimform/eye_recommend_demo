import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { PrismaService } from 'src/database/prisma.service';
import { ENV } from '../common/constants';
import { HealthService, LoggerService } from '../common/services';
import { validateEnvVariables } from '../common/utils';
import appConfig from '../config/app.config';
import databaseConfig from '../config/database.config';
import jwtConfig from '../config/jwt.config';
import { AuthGuard, CustomThrottlerGuard } from '../core/guards';
import { HttpExceptionsFilter, ResponseInterceptor } from '../core/interceptors';
import { TraceMiddleware } from '../core/middleware';
import { AuthModule } from '../modules/auth/auth.module';
import { JobsModule } from '../modules/jobs/jobs.module';
import { UserModule } from '../modules/user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load .env files: prefer env-specific file (e.g. .env.development) then fallback to .env
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      // In production we expect env vars to be provided by the environment (e.g. container/platform)
      ignoreEnvFile: process.env.NODE_ENV === ENV.PRODUCTION,
      load: [appConfig, databaseConfig, jwtConfig],
      validate: validateEnvVariables,
    }),
    I18nModule.forRootAsync({
      resolvers: [AcceptLanguageResolver],
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: { path: join(__dirname, '../i18n/'), watch: true },
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 10,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    HealthService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    LoggerService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Exclude health-check route from tracing middleware.
    // The app uses a global prefix `api` and versioning prefix `v`, so the full path is `/api/v1/health-check`.
    consumer
      .apply(TraceMiddleware)
      .exclude({ path: 'api/v1/health-check', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
