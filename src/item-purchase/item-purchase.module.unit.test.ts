jest.mock('@nestjs/common', () => ({ Module: jest.fn() }));
jest.mock('@nestjs/common/http', () => ({ HttpModule: jest.fn() }));
jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: { forFeature: jest.fn() },
}));
jest.mock('./item-purchase.service', () => class ItemPurchaseService {});

import { ItemPurchaseModule } from './item-purchase.module';

describe('ItemPurchaseModule', () => {
  describe('Initialization', () => {
    it('should be able to create', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -
      const module = new ItemPurchaseModule();

      // Assert (Then)
      expect(module).toBeDefined();
    });
  });
});
