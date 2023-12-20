import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PostMessage extends Document {
    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    group: string;
}

export const PostMessageSchema = SchemaFactory.createForClass(PostMessage);
