import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOneItemDto, CreateManyItemsDto } from './dto';
import { ItemRo, TotalsRo } from './ro';
import { Item } from './item.entity';
import { ZombieService } from '../zombie/zombie.service';
import { ItemPurchaseService } from '../item-purchase/item-purchase.service';
import { CurrencyService } from '../currency/currency.service';
import { Zombie } from '../zombie/zombie.entity';
import { ItemRepository } from './item.repository';
import * as config from 'config';

const logicConfig = config.get('logic');

@Injectable()
export class ItemService {
  public readonly maximumItemsPerZombieCount: number =
    logicConfig.maximumItemsPerZombieCount;

  public constructor(
    @InjectRepository(ItemRepository) private itemRepository: ItemRepository,
    private readonly zombieService: ZombieService,
    private readonly itemPurchaseService: ItemPurchaseService,
    private readonly currencyService: CurrencyService,
  ) {}

  public async createOne(
    zombieId: number,
    createItemDto: CreateOneItemDto,
  ): Promise<ItemRo> {
    const zombieRos = await this.createMany(zombieId, {
      externalIds: [createItemDto.externalId],
    });
    return zombieRos[0];
  }

  public async createMany(
    zombieId: number,
    createItemsDto: CreateManyItemsDto,
  ): Promise<ItemRo[]> {
    const { zombie, items } = await this.findZombieItemsPairByZombieId(
      zombieId,
    );

    if (createItemsDto.externalIds.length === 0) {
      return [];
    }

    this.assertCreateManyAllowed(items, createItemsDto);

    const purchasedItems = await this.itemPurchaseService.purchaseItems(
      createItemsDto.externalIds,
    );

    const newItemPromises = purchasedItems.map(async (purchasedItem) => {
      const item = new Item();

      item.externalId = purchasedItem.id;
      item.name = purchasedItem.name;
      item.price = purchasedItem.price;
      item.zombie = zombie;

      await item.save();

      return item;
    });

    const newItems = await Promise.all(newItemPromises);

    return newItems.map((item) => ItemRo.fromItemEntity(item, zombie.id));
  }

  public async findOne(zombieId: number, id: number): Promise<ItemRo> {
    const item = await this.itemRepository.findItemByIds(zombieId, id);
    return ItemRo.fromItemEntity(item, zombieId);
  }

  public async findAll(zombieId: number): Promise<ItemRo[]> {
    const { zombie, items } = await this.findZombieItemsPairByZombieId(
      zombieId,
    );

    return items.map((item) => ItemRo.fromItemEntity(item, zombie.id));
  }

  public async findTotals(zombieId: number): Promise<TotalsRo> {
    const { items } = await this.findZombieItemsPairByZombieId(zombieId);

    let totalPlnAmount = 0;
    let totalUsdAmount = 0;
    let totalEurAmount = 0;

    if (items.length !== 0) {
      totalPlnAmount = items
        .map((item) => item.price)
        .reduce((accumulatedAmount, price) => accumulatedAmount + price);

      totalUsdAmount = await this.currencyService.convertPlnToUsd(
        totalPlnAmount,
      );
      totalEurAmount = await this.currencyService.convertPlnToEur(
        totalPlnAmount,
      );
    }

    return new TotalsRo(totalPlnAmount, totalEurAmount, totalUsdAmount);
  }

  public async remove(zombieId: number, id: number): Promise<void> {
    await this.itemRepository.removeItemByIds(zombieId, id);
  }

  private assertCreateManyAllowed(
    currentItems: Item[],
    createItemsDto: CreateManyItemsDto,
  ): void {
    if (
      currentItems.length + createItemsDto.externalIds.length >
      this.maximumItemsPerZombieCount
    ) {
      throw new ForbiddenException(
        `Tried to exceed maximum number of items per zombie (${this.maximumItemsPerZombieCount})`,
      );
    }
  }

  private async findZombieItemsPairByZombieId(
    zombieId: number,
  ): Promise<{ zombie: Zombie; items: Item[] }> {
    const zombie = await this.zombieService.findZombieById(zombieId);
    const items = await this.itemRepository.findItemsByZombieId(zombieId);
    return { zombie, items };
  }
}
