import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { UserDocument } from "../users/entities/user.schema";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authSrv: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.json(await this.authSrv.login(user, response));
  }
}
