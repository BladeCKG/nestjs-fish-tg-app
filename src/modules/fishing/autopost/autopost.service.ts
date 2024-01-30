import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import fs from 'fs';
import input from 'input';
import { Api, TelegramClient } from 'telegram';
import { CustomFile } from 'telegram/client/uploads';
import { StringSession } from 'telegram/sessions';
import { folderExists, getRandomFile } from '../../../common/functions';
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
        this.autopost();
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
                    // await client.invoke(new Api.channels.JoinChannel({ channel: group.group_id }));
                    if (Math.random() < 0.1) {
                        const baseFolder = './files';
                        const folder = Math.random() < 0.5 && folderExists(`${baseFolder}/${group.group_id}`) ? `${baseFolder}/${group.group_id}` : `${baseFolder}/@all`;
                        const file = getRandomFile(folder);
                        await client.sendFile(group.group_id, { file });
                    } else {
                        await client.sendMessage(group.group_id, {
                            message,
                        });
                    }
                    await client.disconnect();
                    await client.destroy();
                } catch (error) {
                    this.logger.error(`Error in Posting Message to Group [${group.group_id}] by User [${name}]: ${error.stack}`);
                }
            }
        } catch (error) {}
    }

    // @Cron('0 */2 * * * *', { name: 'autopost' })
    async createGroup() {
        try {
            const groups = await this.postGroupRepository.getAllPostGroups();
            const groupTitle = '';
            const groupUsername = '';
            const groupDesc = '';
            const groupSlug = '';
            for (const group of groups) {
                try {
                    const { session, name } = await this.userRepository.getRandomUser();
                    const message = await this.postMessageRepository.getRandomMessage(group.group_id);
                    this.logger.log(`Creating Group by User [${name}]`);
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
                    // await client.invoke(new Api.channels.JoinChannel({ channel: group.group_id }));

                    const photoPath = 'photo.png';

                    const targetChannelFullUsername = '@BabyJerryCoin';
                    const fullChatInfo = await client.invoke(new Api.channels.GetFullChannel({ channel: targetChannelFullUsername }));
                    const photo = fullChatInfo.fullChat.chatPhoto?.originalArgs as Api.Photo;
                    // console.log(fullChatInfo);
                    const sender = await client.getSender(photo.dcId);
                    const photoFile = (await sender.send(
                        new Api.upload.GetFile({
                            location: new Api.InputPhotoFileLocation({
                                accessHash: photo.accessHash,
                                fileReference: photo.fileReference,
                                id: photo.id,
                                thumbSize: photo.sizes[0].type,
                            }),
                            precise: true,
                            limit: 1024 * 1024,
                        }),
                    )) as Api.upload.GetFile;
                    await bytesToFile((photoFile.originalArgs as Api.upload.File).bytes, photoPath);

                    const groupTitle = (fullChatInfo.chats[0].originalArgs as Api.Chat).title;
                    const groupAbout = fullChatInfo.fullChat.about;
                    const groupUsername = 'aksjdhfaosifhsdf';
                    const result = await client.invoke(
                        new Api.channels.CreateChannel({
                            megagroup: true,
                            title: groupTitle,
                            about: groupAbout,
                        }),
                    );

                    const groupId = JSON.parse(JSON.stringify(result))['chats'][0]['id'];
                    console.log(groupId);
                    const groupIdInt = 0 - parseInt(groupId);
                    const isUsernameFine = await client.invoke(
                        new Api.channels.CheckUsername({
                            channel: groupIdInt,
                            username: groupUsername,
                        }),
                    );
                    console.log(isUsernameFine);
                    await client.invoke(
                        new Api.channels.UpdateUsername({
                            channel: groupIdInt,
                            username: groupUsername,
                        }),
                    );
                    const groupFullUsername = `@${groupUsername}`;
                    const me = await client.getMe();
                    await client.invoke(
                        new Api.channels.EditAdmin({
                            channel: groupFullUsername,
                            userId: (me as Api.User).username,
                            adminRights: new Api.ChatAdminRights({
                                changeInfo: true,
                                postMessages: true,
                                editMessages: true,
                                deleteMessages: true,
                                banUsers: true,
                                inviteUsers: true,
                                pinMessages: true,
                                addAdmins: true,
                                anonymous: true,
                                manageCall: true,
                                other: true,
                            }),
                            rank: '',
                        }),
                    );
                    await client.invoke(
                        new Api.channels.EditPhoto({
                            channel: groupFullUsername,
                            photo: new Api.InputChatUploadedPhoto({
                                file: await client.uploadFile({
                                    workers: 1,
                                    file: new CustomFile(photoPath, fs.statSync(photoPath).size, photoPath),
                                }),
                            }),
                        }),
                    );
                    await client.disconnect();
                    await client.destroy();
                } catch (error) {
                    this.logger.error(`Error in Posting Message to Group [${group.group_id}] by User [${name}]: ${error.stack}`);
                }
            }
        } catch (error) {}
    }
}
function bytesToFile(bytes: Buffer, photoPath: string) {
    throw new Error('Function not implemented.');
}
