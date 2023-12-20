import { Inject, Injectable } from '@nestjs/common';
import input from 'input';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { ConfigService } from '../../../config/config.service';
import { ForwardGroupRepository } from '../../../repositories/forward_group.repository';
import { UserRepository } from '../../../repositories/user.repository';

@Injectable()
export class ForwardService {
    public apiId: number;
    public apiHash: string;
    constructor(
        private readonly userRepository: UserRepository,
        private readonly forwardGroupRepository: ForwardGroupRepository,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        this.apiId = this.configService.getTGAppConfig().api_id;
        this.apiHash = this.configService.getTGAppConfig().api_hash;
    }

    // @Cron(CronExpression.EVERY_30_MINUTES, { name: 'nft-checker' })
    async forward() {
        try {
            const channelSrc = '@jhgihgiuh';
            const msgId = 6;
            const { session } = await this.userRepository.getUserForForwarding();
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
            console.log('You should now be connected.');
            console.log(client.session.save()); // Save this string to avoid logging in again

            const groups = await this.forwardGroupRepository.getAllForwardGroups();
            for (const groupDst of groups) {
                await client.forwardMessages(groupDst, {
                    messages: [6],
                    fromPeer: channelSrc,
                });
            }
        } catch (error) {}
    }
}
