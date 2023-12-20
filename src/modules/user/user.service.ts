import { Injectable } from '@nestjs/common';
import { Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto) {
        const createdUser = await this.userRepository.createUser(createUserDto);
        return createdUser;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId) {
        return await this.userRepository.getUserById(id);
    }
}
