import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private userService: UserService) {}

    @Post('/createUser')
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const newUser: any = await this.userService.createUser(createUserDto);
            return res.status(HttpStatus.CREATED).send(newUser);
        } catch (error) {
            throw new BadRequestException(error);
        } finally {
        }
    }

    @Get('/getUserById/:id')
    async getCompanyById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const user: any = await this.userService.getUserById(id);
        return res.status(HttpStatus.OK).send(user);
    }
}
