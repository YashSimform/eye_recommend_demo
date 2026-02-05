import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
