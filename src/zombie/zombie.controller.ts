import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ZombieService } from './zombie.service';
import { CreateZombieDto, UpdateZombieDto } from './dto';
import { ZombieRo } from './ro';

@Controller('zombies')
export class ZombieController {
  constructor(private readonly zombieService: ZombieService) {}

  @Post()
  @UsePipes(ValidationPipe)
  public async create(
    @Body() createZombieDto: CreateZombieDto,
  ): Promise<ZombieRo> {
    return this.zombieService.create(createZombieDto);
  }

  @Get()
  public async findAll(): Promise<ZombieRo[]> {
    return this.zombieService.findAll();
  }

  @Get('/:id')
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ZombieRo> {
    return this.zombieService.findOne(id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZombieDto: UpdateZombieDto,
  ) {
    return this.zombieService.update(id, updateZombieDto);
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.zombieService.remove(id);
  }
}
