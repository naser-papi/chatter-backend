import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ITokenPayload } from "@/auth/dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly configSrv: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies["Authorization"],
      ]),
      secretOrKey: configSrv.getOrThrow("JWT_SECRET"),
    });
  }
  validate(payload: ITokenPayload) {
    return payload;
  }
}
