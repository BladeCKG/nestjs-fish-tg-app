import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    number: string;

    @Prop({ required: true })
    session: string;

    @Prop({ type: Boolean, default: true })
    is_alive: boolean;

    @Prop({ type: [String] })
    roles: string[];

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
