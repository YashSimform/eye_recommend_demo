import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sentry from '@sentry/node';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { ENV } from '../../common/constants';
import { ERROR_MSG } from '../../common/messages';
import { LoggerService } from '../../common/services';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const i18n = I18nContext.current(host);
    const response = ctx.getResponse<Response>();
    const env = this.configService.get<string>('app.env');

    if (exception instanceof HttpException) {
      if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(exception);
        if (env === ENV.PRODUCTION || env === ENV.STAGING) {
          sentry.captureException(exception);
        }
      }
      return this.handleHttpException(exception, response, i18n);
    } else {
      this.logger.error(exception);
      if (env === ENV.PRODUCTION || env === ENV.STAGING) {
        sentry.captureException(exception);
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: this.translateErrorMessage(ERROR_MSG.SERVER.INTERNAL_SERVER, i18n),
        data: null,
        error: null,
      });
    }
  }

  private handleHttpException(
    exception: HttpException,
    response: Response,
    i18n: I18nContext,
  ): Response<string, Record<string, unknown>> {
    const errMsg = exception.message;
    const statusCode = exception.getStatus();
    if (
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR &&
      errMsg.toLowerCase().includes('unique constraint')
    ) {
      return response.status(HttpStatus.CONFLICT).json({
        message: this.translateErrorMessage(ERROR_MSG.DB.VALIDATION.UQ_ERROR, i18n),
        data: null,
        error: null,
      });
    }

    if (
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR &&
      errMsg.toLowerCase().includes('foreign key constraint')
    ) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: this.translateErrorMessage(ERROR_MSG.DB.VALIDATION.FK_ERROR, i18n),
        data: null,
        error: null,
      });
    }

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: this.translateErrorMessage(ERROR_MSG.SERVER.INTERNAL_SERVER, i18n),
        data: null,
        error: null,
      });
    }

    if (exception instanceof NotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message:
          this.translateErrorMessage(ERROR_MSG.SERVER.PAGE_NOT_FOUND, i18n) || 'Page not found',
        data: null,
        error: null,
      });
    }

    if (exception instanceof BadRequestException) {
      const validationResponse: unknown = exception.getResponse();
      let messages: string[] = [];

      // Normalize different shapes of validation responses
      if (typeof validationResponse === 'object' && validationResponse !== null) {
        const resp = validationResponse as Record<string, unknown>;
        if (Array.isArray(resp.message)) {
          messages = resp.message.map(m => String(m));
        } else if (typeof resp.message === 'string') {
          messages = [resp.message];
        }
      } else if (typeof validationResponse === 'string') {
        messages = [validationResponse];
      }

      const translatedErrors = messages.map(m => this.translateErrorMessage(m, i18n));
      const latestTranslatedError = translatedErrors.reverse()[0] ?? 'Bad request';
      return response.status(exception.getStatus()).json({
        message: latestTranslatedError,
        data: null,
        error: null,
      });
    }

    return response.status(statusCode).json({
      message: this.translateErrorMessage(errMsg, i18n),
      data: null,
      error: null,
    });
  }

  private translateErrorMessage(errorMessage: string, i18n: I18nContext): string {
    let error = errorMessage;
    const errorMessageArr = errorMessage.split('||');

    if (errorMessageArr.length > 1) {
      error = errorMessageArr[1];
    }

    const [translationKey, argsString] = (error || '').split('|');
    let args;

    try {
      args = argsString ? JSON.parse(argsString) : undefined;
    } catch (err) {
      this.logger.error(err);
      args = undefined;
    }

    try {
      return i18n ? i18n.translate(translationKey, args) : translationKey;
    } catch (err) {
      // If translation fails for any reason, fall back to the translation key
      this.logger.error(err);
      return translationKey;
    }
  }
}
