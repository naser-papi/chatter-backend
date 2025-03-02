import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configSrv = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configSrv.getOrThrow("ALLOWED_ORIGINS").split(","),
    credentials: true, // Whether cookies and credentials are allowed
    allowedHeaders: "Content-Type, Authorization", // Define allowed headers
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Define allowed HTTP methods
  });
  const port = configSrv.getOrThrow("PORT") || 8181;
  await app.listen(parseInt(port, 10));
}

bootstrap();
