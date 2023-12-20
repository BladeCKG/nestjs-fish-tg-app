import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupBotDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    alias: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    group_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}
