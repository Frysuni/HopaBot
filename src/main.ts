import { NestFactory } from "@nestjs/core";
import { AppModule } from "./core/app.module";
import { ConfigService, ConfigType } from "@nestjs/config";
import { AppConfig } from "./core/app.config";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { resolve } from "node:path";
import appRegistrations from "./common/appRegistrations";

void async function() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: false },
  );

  const configService: ConfigService<ConfigType<typeof AppConfig>, true> = app.get(ConfigService);
  const config = configService.get('app', { infer: true });

  await appRegistrations(app.register, config.address);

  if (config.assetsAutoRouting) {
    app.useStaticAssets({
      root: resolve(process.cwd(), 'assets'),
      prefix: '/assets',
    });
  }

  app.enableShutdownHooks();
  app.setGlobalPrefix(config.address.pathname);

  app.listen(config.port);
}();