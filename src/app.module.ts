import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { FishingModule } from './modules/fishing/fishing.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule,
        // MongoDB Connection
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => configService.getMongoConfig(),
        }),
        ScheduleModule.forRoot(),
        UserModule,
        FishingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
