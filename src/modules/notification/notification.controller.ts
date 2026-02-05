import {Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { Public } from 'src/core/decorators';
import { SWAGGER_TAGS } from '../../common/constants';
// import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';

@ApiTags(SWAGGER_TAGS.NOTIFICATION)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  // @Post()
  // async create(@Body() dto: CreateNotificationDto) {
  //   return this.service.create(dto);
  // }

  // @Get()
  // async list(@Query('userId') userId: string) {
  //   return this.service.listForUser(userId);
  // }

  // @Post(':id/read')
  // async markRead(@Param('id') id: string) {
  //   return this.service.markRead(id);
  // }

  // @Public()
  // @Post('send-due')
  // async sendDue() {
  //   return this.service.sendDueNotifications();
  // }
}
