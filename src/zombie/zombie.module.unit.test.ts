function mockDependencies() {
  const fns = {
    ModuleDecorator: jest.fn(),
    ZombieService: jest.fn(),
  };

  jest.mock('@nestjs/common', () => ({ Module: fns.ModuleDecorator }));
  jest.mock('@nestjs/typeorm', () => ({
    TypeOrmModule: { forFeature: jest.fn() },
  }));
  jest.mock('./zombie.service', () => ({ ZombieService: fns.ZombieService }));
  jest.mock('./zombie.controller', () => class ZombieController {});
  jest.mock('./zombie.entity', () => class Zombie {});
  jest.mock('./zombie.repository', () => class ZombieRepository {});

  return fns;
}

let ZombieModule;
let fns;

/*
 * PLEASE NOTE:
 *
 * This test file is just (little bit more than) a *simple placeholder*
 * For more information, see section "Testing @Module-decorated classes"
 * under the file tests/unit/README.md.
 *
 */

describe('ZombieModule', () => {
  beforeAll(async () => {
    fns = mockDependencies();
    ZombieModule = (await import('./zombie.module')).ZombieModule;
  });
  describe('Initialization', () => {
    it('should be able to create', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -
      const module = new ZombieModule();

      // Assert (Then)
      expect(module).toBeDefined();
    });
  });
  describe('Module setup', () => {
    it('should only export one dependency, ZombieService', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -
      new ZombieModule();

      // Assert (Then)
      expect(fns.ModuleDecorator.mock.calls[0][0].exports).toHaveLength(1);
      expect(fns.ModuleDecorator.mock.calls[0][0].exports[0]).toStrictEqual(
        fns.ZombieService,
      );
    });
  });
});
