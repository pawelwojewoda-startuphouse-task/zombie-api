jest.mock('@nestjs/common', () => ({ Module: jest.fn() }));
jest.mock('@nestjs/typeorm', () => ({ TypeOrmModule: { forRoot: jest.fn() } }));
jest.mock('./item/item.module', () => ({ ItemModule: class {} }));
jest.mock('./zombie/zombie.module', () => ({ ZombieModule: class {} }));

import { AppModule } from './app.module';

/*
 * PLEASE NOTE:
 *
 * This test file is just a *simple placeholder*
 * For more information, see section "Testing @Module-decorated classes"
 * under the file tests/unit/README.md.
 *
 */

describe('AppModule', () => {
  describe('Initialization', () => {
    it('should be able to create', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -
      const module = new AppModule();

      // Assert (Then)
      expect(module).toBeDefined();
    });
  });
});
