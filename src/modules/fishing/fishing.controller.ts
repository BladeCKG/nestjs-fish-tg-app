import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGroupBotDto } from './dto/create-group-bot.dto';
import { CreatePostGroupDto } from './dto/create-post-group.dto';
import { CreatePostMessagesDto } from './dto/create-post-message.dto';
import { FishingService } from './fishing.service';

@ApiTags('Fishing')
@Controller('fishing')
export class FishingController {
    constructor(private readonly fishingService: FishingService) {}

    @Post('create-post-messages')
    createPostMessages(@Body() createPostMessagesDto: CreatePostMessagesDto) {
        return this.fishingService.createPostMessages(createPostMessagesDto);
    }

    @Post('create-post-group')
    createPostGroup(@Body() createPostGroupDto: CreatePostGroupDto) {
        return this.fishingService.createPostGroup(createPostGroupDto);
    }

    @Post('create-group-bot')
    createGroupBot(@Body() createGroupBotDto: CreateGroupBotDto) {
        return this.fishingService.createGroupBot(createGroupBotDto);
    }

    @Post('/joinallpostgroups')
    async joinAllPostGroups() {
        return this.fishingService.joinAllPostGroups();
    }
    // @Get()
    // findAll() {
    //     return this.fishingService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.fishingService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFishingDto: UpdateFishingDto) {
    //     return this.fishingService.update(+id, updateFishingDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.fishingService.remove(+id);
    // }
}
