import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMessagesDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    group_id: string;

    @ApiProperty()
    @IsArray()
    messages: string[] = [];
}
