import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostGroup } from '../entities/post_group.entity';
import { CreatePostGroupDto } from '../modules/fishing/dto/create-post-group.dto';

export class PostGroupRepository {
    constructor(@InjectModel(PostGroup.name) private readonly postGroupModel: Model<PostGroup>) {}

    async createPostGroup(group: CreatePostGroupDto) {
        let postGroup = new this.postGroupModel({
            group_id: group.group_id,
            slug: group.group_slug,
        });

        try {
            postGroup = await postGroup.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!postGroup) {
            throw new ConflictException('PostGroup not created');
        }

        return postGroup;
    }

    async getAllPostGroups() {
        let bots: PostGroup[] = [];
        try {
            bots = await this.postGroupModel.find();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return bots;
    }
}
