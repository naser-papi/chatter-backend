import { Injectable } from "@nestjs/common";
import { UserDocument } from "../users/entities/user.schema";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ITokenPayload } from "./types";
@Injectable()
export class AuthService {
  constructor(
    private readonly configSrv: ConfigService,
    private readonly jwtSrv: JwtService,
  ) {}
  async login(user: UserDocument, response: Response) {
    const expiresIn = new Date();
    expiresIn.setSeconds(
      expiresIn.getSeconds() + this.configSrv.getOrThrow("JWT_EXPIRES_IN"),
    );

    const tokenPayload: ITokenPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const token = this.jwtSrv.sign(tokenPayload);
    response.cookie("Authorization", token, {
      expires: expiresIn,
      httpOnly: true,
    });
    return {
      token,
    };
  }
}
