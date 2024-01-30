import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostGroupDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    group_id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    group_slug: string = '';
}
