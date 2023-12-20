import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostGroupDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    group_id: string;
}
