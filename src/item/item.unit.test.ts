jest.mock('./item.entity');

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemPurchaseService } from '../item-purchase/item-purchase.service';
import { CurrencyService } from '../currency/currency.service';
import { ZombieService } from '../zombie/zombie.service';
import { ItemRepository } from './item.repository';
import { ItemRo } from './ro';
import { Item } from './item.entity';

// For convenience, let's define a type which represents
// a class with properties mocked by jest.fn().
// It lets IDE to at first suggests class properties
// available to mock and then to suggests jest.fn's methods.
type MockedClass<T> = {
  [P in keyof Partial<T>]: jest.Mock;
};

describe('Item Unit (ItemController and ItemService)', () => {
  let controller: ItemController;
  let service: ItemService;

  let itemRepositoryMock: MockedClass<ItemRepository>;
  let zombieServiceMock: MockedClass<ZombieService>;
  let itemPurchaseServiceMock: MockedClass<ItemPurchaseService>;
  let currencyServiceMock: MockedClass<CurrencyService>;

  const mockZombieService = () => {
    zombieServiceMock = {
      findZombieById: jest.fn().mockResolvedValue({ id: 1 }),
    };
    return zombieServiceMock;
  };
  const mockItemPurchaseService = () => {
    itemPurchaseServiceMock = {
      purchaseItems: jest.fn(),
    };
    return itemPurchaseServiceMock;
  };
  const mockCurrencyService = () => {
    currencyServiceMock = {
      getPlnToEurRate: jest.fn(),
      getPlnToUsdRate: jest.fn(),
      convertPlnToUsd: jest.fn(),
      convertPlnToEur: jest.fn(),
    };
    return currencyServiceMock;
  };
  const mockItemRepository = () => {
    itemRepositoryMock = {
      findItemByIds: jest.fn(),
      findItemsByZombieId: jest.fn().mockResolvedValue([]),
      removeItemByIds: jest.fn(),
    };
    return itemRepositoryMock;
  };
  function mockMaximumItemsPerZombieCount(service, v) {
    Object.defineProperty(service, 'maximumItemsPerZombieCount', {
      get: () => v,
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        { provide: ItemRepository, useFactory: mockItemRepository },
        { provide: ZombieService, useFactory: mockZombieService },
        { provide: ItemPurchaseService, useFactory: mockItemPurchaseService },
        { provide: CurrencyService, useFactory: mockCurrencyService },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    controller = module.get<ItemController>(ItemController);

    mockMaximumItemsPerZombieCount(service, 5);

    ((Item as any) as jest.Mock).mockClear();
  });

  describe('Initialization', () => {
    it('should result in defined controller', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(controller).toBeDefined();
    });

    it('should result in defined service', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(service).toBeDefined();
    });
  });

  describe('Creating', () => {
    it('should return empty list when empty list passed', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      await controller.create(1, { externalIds: [] });

      // Assert (Then)
      // -
    });

    it('should instantiate and save purchased item', async () => {
      // Arrange (Given)
      itemPurchaseServiceMock.purchaseItems.mockResolvedValue([{}]);

      // Act (When)
      expect(Item).not.toHaveBeenCalled();

      await controller.create(1, { externalId: 1 });

      // Assert (Then)
      expect(Item).toHaveBeenCalledTimes(1);
      expect((Item as any).mock.instances[0].save).toHaveBeenCalledTimes(1);
    });

    it('should instantiate and save each purchased item', async () => {
      // Arrange (Given)
      const length = 3;
      const externalIds = [0, 0, 0];
      const purchasedItems = [{}, {}, {}];
      itemPurchaseServiceMock.purchaseItems.mockResolvedValue(purchasedItems);

      // Act (When)
      expect(Item).not.toHaveBeenCalled();
      expect(Item.save).not.toHaveBeenCalled();

      await controller.create(1, { externalIds });

      // Assert (Then)
      expect(Item).toHaveBeenCalledTimes(length);
      expect((Item as any).mock.instances[0].save).toHaveBeenCalledTimes(1);
      expect((Item as any).mock.instances[1].save).toHaveBeenCalledTimes(1);
      expect((Item as any).mock.instances[2].save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Finding', () => {
    it('should return empty RO array when no items', async () => {
      // Arrange (Given)
      itemRepositoryMock.findItemsByZombieId.mockResolvedValue([]);

      // Act (When)
      const itemRos = await controller.findAll(1);

      // Assert (Then)
      expect(itemRos).toHaveLength(0);
    });

    it('should call repository when finding one item', async () => {
      // Arrange (Given)
      const item = new Item();
      item.id = 567;
      item.externalId = 789;
      item.name = 'Rusty Axe';
      item.price = 250;
      itemRepositoryMock.findItemByIds.mockResolvedValue(item);

      // Act (When)
      expect(itemRepositoryMock.findItemByIds).not.toHaveBeenCalled();
      const itemRo = await controller.findOne(234, 567);

      // Assert (Then)
      expect(itemRepositoryMock.findItemByIds).toHaveBeenCalledTimes(1);
      expect(itemRepositoryMock.findItemByIds).toHaveBeenCalledWith(234, 567);
      expect(itemRo).toEqual(new ItemRo(567, 789, 'Rusty Axe', 250, 234));
    });

    it('should call repository to find exact number of the items', async () => {
      // Arrange (Given)
      itemRepositoryMock.findItemsByZombieId.mockResolvedValue([{}, {}, {}]);

      // Act (When)
      expect(itemRepositoryMock.findItemsByZombieId).not.toHaveBeenCalled();
      const itemRos = await controller.findAll(55);

      // Assert (Then)
      expect(itemRepositoryMock.findItemsByZombieId).toHaveBeenCalledTimes(1);
      expect(itemRepositoryMock.findItemsByZombieId).toHaveBeenCalledWith(55);
      expect(itemRos).toHaveLength(3);
    });
  });

  describe('Fiding totals', () => {
    it('should call convert functions exactly once when finding any item totals', async () => {
      // Arrange (Given)
      itemRepositoryMock.findItemsByZombieId.mockResolvedValue([
        { price: 100 },
      ]);

      // Act (When)
      expect(currencyServiceMock.convertPlnToUsd).not.toHaveBeenCalled();
      expect(currencyServiceMock.convertPlnToEur).not.toHaveBeenCalled();
      await controller.findItemTotals(1);

      // Assert (Then)
      expect(currencyServiceMock.convertPlnToUsd).toHaveBeenCalledTimes(1);
      expect(currencyServiceMock.convertPlnToUsd).toHaveBeenLastCalledWith(100);
      expect(currencyServiceMock.convertPlnToEur).toHaveBeenCalledTimes(1);
      expect(currencyServiceMock.convertPlnToEur).toHaveBeenLastCalledWith(100);
    });

    it('should return zeros when no items', async () => {
      // Arrange (Given)
      itemRepositoryMock.findItemsByZombieId.mockResolvedValue([]);

      // Act (When)
      const totalsRo = await controller.findItemTotals(1);

      // Assert (Then)
      expect(totalsRo.pln).toStrictEqual(0);
      expect(totalsRo.usd).toStrictEqual(0);
      expect(totalsRo.eur).toStrictEqual(0);
    });

    it('should properly sum up prices in all currencies', async () => {
      // Arrange (Given)
      itemRepositoryMock.findItemsByZombieId.mockResolvedValue([
        {
          price: 111,
        },
        {
          price: 222,
        },
        {
          price: 333,
        },
      ]);
      currencyServiceMock.convertPlnToUsd.mockImplementation((v) =>
        Promise.resolve(v * 10),
      );
      currencyServiceMock.convertPlnToEur.mockImplementation((v) =>
        Promise.resolve(v * 100),
      );

      // Act (When)
      const totalsRo = await controller.findItemTotals(1);

      // Assert (Then)
      expect(totalsRo.pln).toStrictEqual(666);
      expect(totalsRo.usd).toStrictEqual(6660);
      expect(totalsRo.eur).toStrictEqual(66600);
    });
  });

  describe('Removing', () => {
    it('should call repository when removing an item', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      expect(itemRepositoryMock.removeItemByIds).not.toHaveBeenCalled();
      await controller.remove(22, 33);

      // Assert (Then)
      expect(itemRepositoryMock.removeItemByIds).toHaveBeenCalled();
      expect(itemRepositoryMock.removeItemByIds).toHaveBeenLastCalledWith(
        22,
        33,
      );
    });

    it('should not respond with any value when removing', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      const result = await controller.remove(1, 1);

      // Assert (Then)
      expect(result).toBeUndefined();
    });
  });

  describe('Limits', () => {
    it('should not allow to add more items than the maximum limit', async () => {
      // Arrange (Given)
      mockMaximumItemsPerZombieCount(service, 3);

      // Act (When)
      await expect(
        async () => await controller.create(1, { externalIds: [1, 2, 3, 4] }),

        // Assert (Then)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Optimization', () => {
    it('should not call ItemPurchaseService when empty list passed', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      await controller.create(1, { externalIds: [] });

      // Assert (Then)
      expect(itemPurchaseServiceMock.purchaseItems).not.toHaveBeenCalled();
    });
  });
});
