import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import input from 'input';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { ConfigService } from '../../../config/config.service';
import { ForwardGroupRepository } from '../../../repositories/forward_group.repository';
import { PostGroupRepository } from '../../../repositories/post_group.repository';
import { PostMessageRepository } from '../../../repositories/post_message.repository';
import { UserRepository } from '../../../repositories/user.repository';

@Injectable()
export class AutopostService {
    public apiId: number;
    public apiHash: string;
    private readonly logger = new Logger(AutopostService.name);
    constructor(
        private readonly userRepository: UserRepository,
        private readonly forwardGroupRepository: ForwardGroupRepository,
        private readonly postMessageRepository: PostMessageRepository,
        private readonly postGroupRepository: PostGroupRepository,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        this.apiId = this.configService.getTGAppConfig().api_id;
        this.apiHash = this.configService.getTGAppConfig().api_hash;
    }

    @Cron('0 */2 * * * *', { name: 'autopost' })
    async autopost() {
        try {
            const groups = await this.postGroupRepository.getAllPostGroups();
            for (const group of groups) {
                try {
                    const { session, name } = await this.userRepository.getRandomUser();
                    const message = await this.postMessageRepository.getRandomMessage(group.group_id);
                    this.logger.log(`Posting Message to Group [${group.group_id}] by User [${name}]`);
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
                    await client.invoke(new Api.channels.JoinChannel({ channel: group.group_id }));
                    await client.sendMessage(group.group_id, {
                        message,
                    });
                } catch (error) {
                    this.logger.error(`Error in Posting Message to Group [${group.group_id}] by User [${name}]: ${error.stack}`);
                }
            }
        } catch (error) {}
    }
}
