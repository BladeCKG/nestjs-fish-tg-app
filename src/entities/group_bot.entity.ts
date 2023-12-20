import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GroupBot extends Document {
    @Prop({ required: true })
    alias: string;

    @Prop({ required: true })
    group_id: string;

    @Prop({ required: true, unique: true })
    token: string;

    @Prop({})
    message: string;

    @Prop({ required: true })
    image: string;
}

export const GroupBotSchema = SchemaFactory.createForClass(GroupBot);
