import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupBot } from '../entities/group_bot.entity';
import { CreateGroupBotDto } from '../modules/fishing/dto/create-group-bot.dto';

export class GroupBotRepository {
    constructor(@InjectModel(GroupBot.name) private readonly groupBotModel: Model<GroupBot>) {}

    async createGroupBot(groupBot: CreateGroupBotDto) {
        let postGroup = new this.groupBotModel({
            alias: groupBot.alias,
            group_id: groupBot.group_id,
            token: groupBot.token,
            image: `${groupBot.alias}_airdrop.png`,
        });

        try {
            postGroup = await postGroup.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!postGroup) {
            throw new ConflictException('GroupBot not created');
        }

        return postGroup;
    }

    async getAllGroupBots() {
        let bots: GroupBot[] = [];
        try {
            bots = await this.groupBotModel.find();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return bots;
    }
}
