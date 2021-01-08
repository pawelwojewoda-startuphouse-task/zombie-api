import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Zombie } from './zombie.entity';

@EntityRepository(Zombie)
export class ZombieRepository extends Repository<Zombie> {
  public async findZombieById(id: number): Promise<Zombie> {
    const foundZombie = await this.findOne({
      where: { id },
    });

    if (!foundZombie) {
      this.throwNotFoundException(id);
    }

    return foundZombie;
  }

  public async findAllZombies(): Promise<Zombie[]> {
    return this.find();
  }

  public async removeZombieById(id: number): Promise<void> {
    const result = await this.delete({ id });

    if (result.affected === 0) {
      this.throwNotFoundException(id);
    }
  }

  private throwNotFoundException(id: number): never {
    throw new NotFoundException(`Could not find zombie with id "${id}"`);
  }
}
