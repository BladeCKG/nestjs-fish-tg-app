import { Inject, Injectable, Logger } from '@nestjs/common';
import input from 'input';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { ConfigService } from '../../config/config.service';
import { GroupBotRepository } from '../../repositories/group_bot.repository';
import { PostGroupRepository } from '../../repositories/post_group.repository';
import { PostMessageRepository } from '../../repositories/post_message.repository';
import { UserRepository } from '../../repositories/user.repository';
import { CreateGroupBotDto } from './dto/create-group-bot.dto';
import { CreatePostGroupDto } from './dto/create-post-group.dto';
import { CreatePostMessagesDto } from './dto/create-post-message.dto';
@Injectable()
export class FishingService {
    public apiId: number;
    public apiHash: string;
    private readonly logger = new Logger(FishingService.name);
    constructor(
        private readonly postMessageRepository: PostMessageRepository,
        private readonly postGroupRepository: PostGroupRepository,
        private readonly groupBotRepository: GroupBotRepository,
        private readonly userRepository: UserRepository,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        this.apiId = this.configService.getTGAppConfig().api_id;
        this.apiHash = this.configService.getTGAppConfig().api_hash;
    }

    async createPostMessages(messagesDto: CreatePostMessagesDto) {
        await this.postMessageRepository.createPostMessage(messagesDto);
    }

    async createPostGroup(createPostGroupDto: CreatePostGroupDto) {
        await this.postGroupRepository.createPostGroup(createPostGroupDto);
        await this.joinPostGroup(createPostGroupDto.group_id);
    }

    async createGroupBot(createGroupBotDto: CreateGroupBotDto) {
        await this.groupBotRepository.createGroupBot(createGroupBotDto);
    }

    async joinPostGroup(groupId) {
        try {
            const users = await this.userRepository.getAllUsers();
            for (const { session, name } of users) {
                const message = await this.postMessageRepository.getRandomMessage(groupId);
                this.logger.log(`Joining to Group [${groupId}] by User [${name}]`);
                const stringSession = new StringSession(session);
                const client = new TelegramClient(stringSession, this.apiId, this.apiHash, {
                    connectionRetries: 5,
                });
                await client.start({
                    phoneNumber:
                        // (user.phone as string) ||
                        async () => await input.text('Please enter your number: '),
                    password: async () => await input.text('Please enter your password: '),
                    phoneCode: async () => await input.text('Please enter the code you received: '),
                    onError: (err) => console.log(err),
                });
                // console.log('You should now be connected.');
                // console.log(client.session.save()); // Save this string to avoid logging in again
                await client.invoke(new Api.channels.JoinChannel({ channel: groupId }));
                await client.disconnect();
                await client.destroy();
            }
        } catch (error) {
            this.logger.error(`Error in Joining to Group [${groupId}] by User [${name}]: ${error.stack}`);
        }
    }

    async joinAllPostGroups() {
        try {
            const groups = await this.postGroupRepository.getAllPostGroups();
            for (const group of groups) {
                await this.joinPostGroup(group.group_id);
            }
        } catch (error) {}
    }
}
