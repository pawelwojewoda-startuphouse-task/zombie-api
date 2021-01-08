import { Item } from './item.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  public async findItemByIds(zombieId: number, id: number): Promise<Item> {
    const foundItems = await this.find({ where: { zombie: zombieId, id } });

    if (foundItems.length === 0) {
      this.throwNotFoundException(zombieId, id);
    }

    return foundItems[0];
  }

  public async findItemsByZombieId(zombieId: number): Promise<Item[]> {
    return this.find({ where: { zombie: zombieId } });
  }

  public async removeItemByIds(zombieId: number, id: number) {
    const foundItem = await this.findItemByIds(zombieId, id);
    await this.remove(foundItem);
  }

  private throwNotFoundException(zombieId: number, id: number): never {
    throw new NotFoundException(
      `Could not find item with id "${id}" belonging to zombie with id "${zombieId}"`,
    );
  }
}
