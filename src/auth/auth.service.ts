import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDocument } from "@/users/entities/user.schema";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ITokenPayload } from "@/auth/dto";

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
      sameSite: "none",
      secure: true,
    });
    return {
      token,
    };
  }

  async validateWSRequest(request?: Request): Promise<ITokenPayload> {
    const cookieHeader = request?.headers?.cookie;
    if (!cookieHeader) {
      throw new UnauthorizedException("No Cookie Provided in Header");
    }
    const cookies = cookieHeader.split("; ");
    const authCookie = cookies.find((cookie) =>
      cookie.startsWith("Authorization"),
    );
    const token = authCookie?.split("=")[1];
    if (!token) {
      throw new UnauthorizedException("No Token Provided in Cookie");
    }
    return this.jwtSrv.verify(token);
  }

  async logout(response: Response) {
    response.clearCookie("Authorization");
    return {
      message: "Logged out",
    };
  }
}
