import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForwardGroup } from '../entities/forward_group.entity';

export class ForwardGroupRepository {
    constructor(@InjectModel(ForwardGroup.name) private readonly forwardGroupModel: Model<ForwardGroup>) {}

    async getAllForwardGroups() {
        let groups = [];
        try {
            groups = await this.forwardGroupModel.find();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return groups;
    }
}
