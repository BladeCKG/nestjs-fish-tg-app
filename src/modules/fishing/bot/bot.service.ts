import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { ConfigService } from '../../../config/config.service';
import { ForwardGroupRepository } from '../../../repositories/forward_group.repository';
import { GroupBotRepository } from '../../../repositories/group_bot.repository';
import { UserRepository } from '../../../repositories/user.repository';

@Injectable()
export class BotService {
    public apiId: number;
    public apiHash: string;
    private readonly logger = new Logger(BotService.name);
    constructor(
        private readonly userRepository: UserRepository,
        private readonly forwardGroupRepository: ForwardGroupRepository,
        private readonly groupBotRepository: GroupBotRepository,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        this.apiId = this.configService.getTGAppConfig().api_id;
        this.apiHash = this.configService.getTGAppConfig().api_hash;
    }

    @Cron(CronExpression.EVERY_10_MINUTES, { name: 'bot' })
    async botpost() {
        try {
            const bots = await this.groupBotRepository.getAllGroupBots();
            for (const bot of bots) {
                try {
                    this.logger.error(`Bot Posting [group: ${bot.group_id}, bot: ${bot.alias}]`);
                    const session = null;
                    const stringSession = new StringSession(session); // fill this later with the value from session.save()
                    const client = new TelegramClient(stringSession, this.apiId, this.apiHash, {
                        connectionRetries: 5,
                    });
                    await client.start({
                        botAuthToken: bot.token,
                        onError: (err) => console.log(err),
                    });
                    console.log('Bot should now be connected.');
                    await client.sendMessage(bot.group_id, {
                        file: bot.image,
                        message: bot.message,
                    });
                } catch (error) {
                    this.logger.error(`Error in Bot Posting [group: ${bot.group_id}, bot: ${bot.alias}]: ${error.stack}`);
                }
            }
        } catch (error) {}
    }
}
