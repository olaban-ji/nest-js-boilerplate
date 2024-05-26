import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

  async create(user: any) {
    const userExists = await this.findOne({ email: user.email });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    return await this.userModel.create(user);
  }

  async findOne(query: object) {
    return await this.userModel.findOne(query);
  }
}
