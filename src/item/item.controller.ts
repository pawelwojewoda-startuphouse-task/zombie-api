import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, CreateOneItemDto, CreateManyItemsDto } from './dto';
import { ItemRo, TotalsRo } from './ro';
import { ParseIntPipe } from '@nestjs/common';

@Controller('zombies/:zombieId/items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UsePipes(ValidationPipe)
  public async create(
    @Param('zombieId', ParseIntPipe) zombieId: number,
    @Body() dto: CreateItemDto,
  ): Promise<ItemRo | ItemRo[]> {
    return 'externalIds' in dto
      ? this.itemService.createMany(zombieId, dto as CreateManyItemsDto)
      : this.itemService.createOne(zombieId, dto as CreateOneItemDto);
  }

  @Get(':id')
  public async findOne(
    @Param('zombieId', ParseIntPipe) zombieId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemRo> {
    return this.itemService.findOne(zombieId, id);
  }

  @Get()
  public async findAll(
    @Param('zombieId', ParseIntPipe) zombieId: number,
  ): Promise<ItemRo[]> {
    return this.itemService.findAll(zombieId);
  }

  @Get('totals')
  public async findItemTotals(
    @Param('zombieId', ParseIntPipe) zombieId: number,
  ): Promise<TotalsRo> {
    return this.itemService.findTotals(zombieId);
  }

  @Delete(':id')
  public async remove(
    @Param('zombieId', ParseIntPipe) zombieId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.itemService.remove(zombieId, id);
  }
}
