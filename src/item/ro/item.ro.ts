import { Item } from '../item.entity';

export class ItemRo {
  public links = null;

  constructor(
    public id: number,
    public externalId: number,
    public name: string,
    public price: number,
    zombieId: number,
  ) {
    this.links = [
      {
        rel: 'owner',
        href: `zombies/${zombieId}`,
      },
    ];
  }

  public static fromItemEntity(item: Item, zombieId: number): ItemRo {
    return new ItemRo(
      item.id,
      item.externalId,
      item.name,
      item.price,
      zombieId,
    );
  }
}
