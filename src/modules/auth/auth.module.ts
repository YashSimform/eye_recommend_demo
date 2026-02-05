import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../database/database.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordResetTokenModule } from '../password-reset-token/password-reset-token.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    RoleModule,
    PasswordResetTokenModule,
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
