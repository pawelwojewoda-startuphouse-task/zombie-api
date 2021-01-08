jest.mock('@nestjs/common', () => ({ Module: jest.fn() }));
jest.mock('@nestjs/common/http', () => ({ HttpModule: jest.fn() }));
jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: { forFeature: jest.fn() },
}));
jest.mock('./currency.service', () => class CurrencyService {});

import { CurrencyModule } from './currency.module';

/*
 * PLEASE NOTE:
 *
 * This test file is just a *simple placeholder*
 * For more information, see section "Testing @Module-decorated classes"
 * under the file tests/unit/README.md.
 *
 */

describe('CurrencyModule', () => {
  describe('Initialization', () => {
    it('should be able to create', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -
      const module = new CurrencyModule();

      // Assert (Then)
      expect(module).toBeDefined();
    });
  });
});
