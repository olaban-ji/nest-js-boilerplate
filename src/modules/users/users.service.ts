import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private prisma: PrismaService,
  ) {}
  async create(user: any) {
    const userExists = await this.findOne({ email: user.email });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = await this.userModel.create(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser.toObject();
    return result;
  }

  async findOne(query: object) {
    return await this.userModel.findOne(query);
  }
}
