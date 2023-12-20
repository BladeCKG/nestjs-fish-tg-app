import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ForwardGroup extends Document {
    @Prop({ required: true, unique: true })
    group_id: string;
}

export const ForwardGroupSchema = SchemaFactory.createForClass(ForwardGroup);
