import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CurrentUser } from "@/auth/current-user.decorator";
import { ITokenPayload } from "@/auth/dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { UsersService } from "@/users/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put("update-profile")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("avatarImage"))
  async updateProfile(
    @CurrentUser() user: ITokenPayload,
    @Body("fullName") fullName: string,
    @UploadedFile() avatarImage: Express.Multer.File,
  ) {
    const resp = await this.usersService.updateProfile(
      user.id,
      fullName,
      avatarImage,
    );
    return {
      fullName: resp.fullName,
      avatarUrl: resp.avatarUrl,
    };
  }
}
