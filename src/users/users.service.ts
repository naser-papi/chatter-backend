import * as bycrypt from "bcrypt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { UsersRepository } from "./users.repository";
import { UserDocument } from "./entities/user.schema";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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

  remove(id: string) {
    return this.usersRepository.findOneAndDelete({ _id: id });
  }

  async validateUserPassword(
    email: string,
    pass: string,
  ): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({ email });
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
