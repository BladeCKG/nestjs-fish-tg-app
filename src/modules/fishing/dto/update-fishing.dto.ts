import { PartialType } from '@nestjs/mapped-types';
import { CreateFishingDto } from './create-fishing.dto';

export class UpdateFishingDto extends PartialType(CreateFishingDto) {}
