import { Module } from "@nestjs/common";
import { MemberLeavingNotificationService } from "./member-leaving-notification.service";

@Module({
  providers: [
    MemberLeavingNotificationService,
  ],
})
export class MemberLeavingNotificationModule {}