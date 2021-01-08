import { HttpService } from '@nestjs/common';
import { ItemPurchaseService } from './item-purchase.service';
import { ExternalItemData } from 'src/item/models';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('ItemPurchaseService', () => {
  let service: ItemPurchaseService;
  let httpServiceMock: HttpService = null;

  function mockHtttpService(response) {
    httpServiceMock = {
      get: jest.fn().mockImplementation(() => of(response)),
    } as any;
  }

  const externalItemData: ExternalItemData = {
    timestamp: 1608508800000,
    items: [
      {
        id: 1,
        name: 'Invicible Sword',
        price: 1500,
      },
      {
        id: 2,
        name: 'Stylish Hat',
        price: 999,
      },
      {
        id: 3,
        name: 'Rotten Meat',
        price: 10,
      },
      {
        id: 4,
        name: 'Sweater',
        price: 500,
      },
      {
        id: 5,
        name: 'Apple',
        price: 30,
      },
      {
        id: 6,
        name: 'Pear',
        price: 40,
      },
    ],
  };
  const response: AxiosResponse<ExternalItemData> = {
    data: externalItemData,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  beforeEach(() => {
    mockHtttpService(response);
    service = new ItemPurchaseService(httpServiceMock);
  });

  describe('Initialization', () => {
    it('should be defined ', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(service).toBeDefined();
    });
  });

  describe('Optimization', () => {
    it('should not perform any HTTP calls when an empty list is passed', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      expect(httpServiceMock.get).toHaveBeenCalledTimes(0);
      await service.purchaseItems([]);

      // Assert (Then)
      expect(httpServiceMock.get).toHaveBeenCalledTimes(0);
    });

    it('should perform HTTP only once when non-empty list is passed', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      expect(httpServiceMock.get).toHaveBeenCalledTimes(0);
      await service.purchaseItems([1]);

      // Assert (Then)
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Purchasing', () => {
    it('should return empty items list when empty externalId list passed', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      const externalItems = await service.purchaseItems([]);

      // Assert (Then)
      expect(externalItems).toHaveLength(0);
    });

    it('should purchase only desired items', async () => {
      // Arrange (Given)
      // -

      const desiredExternalItemIds = [2, 3, 5, 7, 8, 9, 10];
      const expectedExternalItems = [
        {
          id: 2,
          name: 'Stylish Hat',
          price: 999,
        },
        {
          id: 3,
          name: 'Rotten Meat',
          price: 10,
        },
        {
          id: 5,
          name: 'Apple',
          price: 30,
        },
      ];

      // Act (When)
      const purchasedItems = await service.purchaseItems(
        desiredExternalItemIds,
      );

      // Assert (Then)
      expect(purchasedItems).toEqual(expectedExternalItems);
    });

    it('should allow purchase the same item multiple times when repeated external ids are listed', async () => {
      // Arrange (Given)
      // -

      const desiredExternalItemIds = [2, 2];
      const expectedExternalItems = [
        {
          id: 2,
          name: 'Stylish Hat',
          price: 999,
        },
        {
          id: 2,
          name: 'Stylish Hat',
          price: 999,
        },
      ];

      // Act (When)
      const purchasedItems = await service.purchaseItems(
        desiredExternalItemIds,
      );

      // Assert (Then)
      expect(purchasedItems).toEqual(expectedExternalItems);
    });

    it('should correctly (in order and length) purchase items when external ids are intertwined', async () => {
      // Arrange (Given)
      // -

      const desiredExternalItemIds = [2, 5, 2, 5];
      const expectedExternalItems = [
        {
          id: 2,
          name: 'Stylish Hat',
          price: 999,
        },
        {
          id: 2,
          name: 'Stylish Hat',
          price: 999,
        },
        {
          id: 5,
          name: 'Apple',
          price: 30,
        },
        {
          id: 5,
          name: 'Apple',
          price: 30,
        },
      ];

      // Act (When)
      const purchasedItems = await service.purchaseItems(
        desiredExternalItemIds,
      );

      // Assert (Then)
      expect(purchasedItems).toEqual(expectedExternalItems);
    });
  });
});
