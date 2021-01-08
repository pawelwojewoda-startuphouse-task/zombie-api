import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ZombieRepository } from './zombie.repository';
import { Zombie } from './zombie.entity';
import { CreateZombieDto, UpdateZombieDto } from './dto';
import { ZombieRo } from './ro';

@Injectable()
export class ZombieService {
  public constructor(
    @InjectRepository(ZombieRepository)
    private zombieRepository: ZombieRepository,
  ) {}

  async create(createZombieDto: CreateZombieDto): Promise<ZombieRo> {
    const zombie = new Zombie();

    zombie.name = createZombieDto.name;
    zombie.createdTimestamp = Date.now();

    await zombie.save();

    return new ZombieRo(zombie.id, zombie.name, zombie.createdTimestamp);
  }

  public async findOne(id: number): Promise<ZombieRo> {
    const zombie = await this.findZombieById(id);

    return new ZombieRo(zombie.id, zombie.name, zombie.createdTimestamp);
  }

  public async findAll(): Promise<ZombieRo[]> {
    const foundZombies = await this.zombieRepository.findAllZombies();
    return foundZombies.map(
      (foundZombie) =>
        new ZombieRo(
          foundZombie.id,
          foundZombie.name,
          foundZombie.createdTimestamp,
        ),
    );
  }

  public async update(
    id: number,
    updateZombieDto: UpdateZombieDto,
  ): Promise<ZombieRo> {
    const zombie = await this.findZombieById(id);
    const { name } = updateZombieDto;

    zombie.name = name;

    await zombie.save();

    return new ZombieRo(zombie.id, zombie.name, zombie.createdTimestamp);
  }

  public async remove(id: number): Promise<void> {
    await this.zombieRepository.removeZombieById(id);
  }

  public async findZombieById(id: number): Promise<Zombie> {
    return this.zombieRepository.findZombieById(id);
  }
}
