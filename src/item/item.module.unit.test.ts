jest.mock('@nestjs/common', () => ({ Module: jest.fn() }));
jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: { forFeature: jest.fn() },
}));
jest.mock('./item.service', () => ({ ItemService: class {} }));
jest.mock('./item.controller', () => ({ ItemController: class {} }));
jest.mock('./item.repository', () => ({ ItemRepository: class {} }));
jest.mock('../currency/currency.module', () => ({ CurrencyModule: class {} }));
jest.mock('../item-purchase/item-purchase.module', () => ({
  ItemPurchaseModule: class {},
}));
jest.mock('../zombie/zombie.module', () => ({ ZombieModule: class {} }));

import { ItemModule } from './item.module';

/*
 * PLEASE NOTE:
 *
 * This test file is just a *simple placeholder*
 * For more information, see section "Testing @Module-decorated classes"
 * under the file tests/unit/README.md.
 *
 */

describe('ItemModule', () => {
  describe('Initialization', () => {
    it('should be able to create', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -
      const module = new ItemModule();

      // Assert (Then)
      expect(module).toBeDefined();
    });
  });
});
