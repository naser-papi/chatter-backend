import * as bycrypt from "bcrypt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { UsersRepository } from "./users.repository";
import { UserDocument } from "./entities/user.schema";
import { Express } from "express";
import { StorageService } from "@/common/storage/storage.service";
import { Types } from "mongoose";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly storageSrv: StorageService,
  ) {}

  create(createUserInput: CreateUserInput) {
    const password = bycrypt.hashSync(createUserInput.password, 10);
    return this.usersRepository.create({ ...createUserInput, password });
  }

  findAll() {
    return this.usersRepository.find({});
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({ _id: id });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = bycrypt.hashSync(updateUserInput.password, 10);
    }

    return this.usersRepository.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...updateUserInput,
        },
      },
    );
  }

  async updateProfile(
    id: string,
    fullName: string,
    avatar: Express.Multer.File,
  ) {
    const blobName = `${Date.now()}-${avatar.originalname}`;
    const url = await this.storageSrv.uploadFile(avatar.buffer, blobName);

    return this.usersRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          fullName,
          avatarUrl: url,
        },
      },
    );
  }

  remove(id: string) {
    return this.usersRepository.findOneAndDelete({ _id: id });
  }

  async validateUserPassword(
    email: string,
    pass: string,
  ): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({ email }, undefined, true);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials!");
    }
    const isPassValid = bycrypt.compareSync(pass, user.password);
    if (!isPassValid) {
      throw new UnauthorizedException("Invalid credentials!");
    }
    return user;
  }
}
