import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfig } from "./app.config";
import { DatabaseModule } from "./database/database.module";
import { DiscordModule } from "./discord/discord.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    ConfigModule.forFeature(AppConfig),
    DatabaseModule,
    DiscordModule,
  ],
})
export class AppModule {}