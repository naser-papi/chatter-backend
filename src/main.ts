import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { join } from "path";
import * as express from "express";

async function bootstrap() {
  console.info(
    `>>>>>>>>>>>>>>>>>>>>>> START THE CHATTER APP BACKEND <<<<<<<<<<<<<<<<<<<<<<<<<<`,
  );
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe());
  console.info("useGlobalPipes Done");
  app.useLogger(app.get(Logger));
  console.info("useLogger Done");
  app.use(cookieParser());
  const configSrv = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configSrv.getOrThrow("ALLOWED_ORIGINS").split(","),
    credentials: true, // Whether cookies and credentials are allowed
    allowedHeaders: "Content-Type, Authorization", // Define allowed headers
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Define allowed HTTP methods
  });
  console.info("enableCors Done");

  app.use("/uploads", express.static(join(__dirname, "..", "storage/uploads")));

  console.info("uploads config Done");

  const port = configSrv.getOrThrow("PORT") || 8000;
  await app.listen(parseInt(port, 10));

  console.info(
    `>>>>>>>>>>>>>>>>>>>>>> Server started on port ${port}<<<<<<<<<<<<<<<<<<<<<<<<<<`,
  );
}

bootstrap();
