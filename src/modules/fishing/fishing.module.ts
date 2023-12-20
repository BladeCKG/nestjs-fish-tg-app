import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { ForwardGroup, ForwardGroupSchema } from '../../entities/forward_group.entity';
import { GroupBot, GroupBotSchema } from '../../entities/group_bot.entity';
import { PostGroup, PostGroupSchema } from '../../entities/post_group.entity';
import { PostMessage, PostMessageSchema } from '../../entities/post_message.entity';
import { User, UserSchema } from '../../entities/user.entity';
import { ForwardGroupRepository } from '../../repositories/forward_group.repository';
import { GroupBotRepository } from '../../repositories/group_bot.repository';
import { PostGroupRepository } from '../../repositories/post_group.repository';
import { PostMessageRepository } from '../../repositories/post_message.repository';
import { UserRepository } from '../../repositories/user.repository';
import { AutopostService } from './autopost/autopost.service';
import { BotService } from './bot/bot.service';
import { FishingController } from './fishing.controller';
import { FishingService } from './fishing.service';

@Module({
    controllers: [FishingController],
    providers: [FishingService, UserRepository, ForwardGroupRepository, ConfigService, AutopostService, PostMessageRepository, PostGroupRepository, GroupBotRepository, BotService],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: ForwardGroup.name, schema: ForwardGroupSchema },
            { name: PostMessage.name, schema: PostMessageSchema },
            { name: GroupBot.name, schema: GroupBotSchema },
            { name: PostGroup.name, schema: PostGroupSchema },
        ]),
        ConfigModule,
    ],
})
export class FishingModule {}
