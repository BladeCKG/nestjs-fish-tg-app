import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PostGroup extends Document {
    @Prop({ required: true })
    group_id: string;
}

export const PostGroupSchema = SchemaFactory.createForClass(PostGroup);
