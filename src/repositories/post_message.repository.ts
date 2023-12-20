import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostMessage } from '../entities/post_message.entity';
import { CreatePostMessagesDto } from '../modules/fishing/dto/create-post-message.dto';

export class PostMessageRepository {
    constructor(@InjectModel(PostMessage.name) private readonly postMessageModel: Model<PostMessage>) {}

    async createPostMessage(messagesDto: CreatePostMessagesDto) {
        try {
            await this.postMessageModel.insertMany(
                messagesDto.messages.map(
                    (message) =>
                        new this.postMessageModel({
                            group: messagesDto.group_id,
                            message: message,
                        }),
                ),
            );
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getRandomMessage(group) {
        let randomMessage = 'hello';
        try {
            const count = await this.postMessageModel.countDocuments({ group });
            const randomIndex = Math.floor(Math.random() * count);
            randomMessage = (await this.postMessageModel.findOne({ group }).skip(randomIndex)).message;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return randomMessage;
    }
}
