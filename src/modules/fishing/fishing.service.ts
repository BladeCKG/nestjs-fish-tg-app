import { Injectable } from '@nestjs/common';
import { GroupBotRepository } from '../../repositories/group_bot.repository';
import { PostGroupRepository } from '../../repositories/post_group.repository';
import { PostMessageRepository } from '../../repositories/post_message.repository';
import { CreateGroupBotDto } from './dto/create-group-bot.dto';
import { CreatePostGroupDto } from './dto/create-post-group.dto';
import { CreatePostMessagesDto } from './dto/create-post-message.dto';

@Injectable()
export class FishingService {
    constructor(
        private readonly postMessageRepository: PostMessageRepository,
        private readonly postGroupRepository: PostGroupRepository,
        private readonly groupBotRepository: GroupBotRepository,
    ) {}

    async createPostMessages(messagesDto: CreatePostMessagesDto) {
        await this.postMessageRepository.createPostMessage(messagesDto);
    }

    async createPostGroup(createPostGroupDto: CreatePostGroupDto) {
        await this.postGroupRepository.createPostGroup(createPostGroupDto);
    }

    async createGroupBot(createGroupBotDto: CreateGroupBotDto) {
        await this.groupBotRepository.createGroupBot(createGroupBotDto);
    }
}
