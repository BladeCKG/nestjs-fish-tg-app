import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../modules/user/dto/createUser.dto';

export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async createUser(createUserDto: CreateUserDto) {
        let user = await this.getUserByPhoneNumber(createUserDto.number);

        if (user) {
            throw new ConflictException('User already exists');
        }

        user = new this.userModel({
            name: createUserDto.name,
            number: createUserDto.number,
            session: createUserDto.session,
            roles: [],
        });

        try {
            user = await user.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user) {
            throw new ConflictException('User not created');
        }

        return user;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId) {
        let user;
        try {
            user = await this.userModel.findById({ _id: id });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async getUserByPhoneNumber(number: string) {
        let user;
        try {
            user = await this.userModel.findOne({ number: number }, 'name number').exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }

    async getUserForForwarding() {
        let user;
        try {
            user = await this.userModel.findOne({ roles: { $elemMatch: { $eq: 'forward' } } }).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }

    async getRandomUser() {
        let user: User;
        try {
            const count = await this.userModel.countDocuments();
            const randomIndex = Math.floor(Math.random() * count);
            user = await this.userModel.findOne().skip(randomIndex);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }
}
