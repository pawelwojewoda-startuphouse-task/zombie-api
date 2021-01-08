jest.mock('./zombie.entity');

import { Test, TestingModule } from '@nestjs/testing';
import { ZombieService } from './zombie.service';
import { ZombieController } from './zombie.controller';

import { Zombie } from './zombie.entity';
import { ZombieRepository } from './zombie.repository';

// For convenience, let's define a type which represents
// a class with properties mocked by jest.fn().
// It lets IDE to at first suggests class properties
// available to mock and then to suggests jest.fn's methods.
type MockedClass<T> = {
  [P in keyof Partial<T>]: jest.Mock;
};

describe('Zombie Unit (ZombieController and ZombieService)', () => {
  let controller: ZombieController;
  let service: ZombieService;

  let zombieRepositoryMock: MockedClass<ZombieRepository>;

  const mockZombieRepository = () => {
    zombieRepositoryMock = {
      findZombieById: jest.fn(),
      findAllZombies: jest.fn(),
      removeZombieById: jest.fn(),
    };
    return zombieRepositoryMock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZombieController],
      providers: [
        ZombieService,
        { provide: ZombieRepository, useFactory: mockZombieRepository },
      ],
    }).compile();

    service = module.get<ZombieService>(ZombieService);
    controller = module.get<ZombieController>(ZombieController);

    ((Zombie as any) as jest.Mock).mockClear();
  });

  describe('Initialization', () => {
    it('should result in defined controller', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(controller).toBeDefined();
    });

    it('should result in defined service', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(service).toBeDefined();
    });
  });

  describe('Creating', () => {
    it('should response zombie with corresponding name when creating', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      const zombieRo = await controller.create({ name: 'Chris' });

      // Assert (Then)
      expect(zombieRo.name).toEqual('Chris');
    });

    it('should instantiate and save zombie when calling create', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      expect(Zombie).not.toHaveBeenCalled();
      expect(Zombie.save).not.toHaveBeenCalled();

      await controller.create({ name: 'Arthur' });

      // Assert (Then)
      expect(Zombie).toHaveBeenCalledTimes(1);
      expect((Zombie as any).mock.instances[0].save).toHaveBeenCalledTimes(1);
    });

    it('should automatically generate positive timestamp', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      const zombieRo = await controller.create({ name: 'Eric' });

      // Assert (Then)
      expect(zombieRo.createdTimestamp).toBeDefined();
      expect(Number.isInteger(zombieRo.createdTimestamp)).toBeTruthy();
      expect(zombieRo.createdTimestamp).toBeGreaterThan(0);
    });
  });

  describe('Finding', () => {
    it('should call repository when finding a zombie', async () => {
      // Arrange (Given)
      zombieRepositoryMock.findZombieById.mockResolvedValue({});

      // Act (When)
      expect(zombieRepositoryMock.findZombieById).not.toHaveBeenCalled();

      await controller.findOne(123);

      // Assert (Then)
      expect(zombieRepositoryMock.findZombieById).toHaveBeenCalledTimes(1);
      expect(zombieRepositoryMock.findZombieById).toHaveBeenLastCalledWith(123);
    });

    it('should response with properly mapped zombie when finding one', async () => {
      // Arrange (Given)
      zombieRepositoryMock.findZombieById.mockResolvedValue({
        name: 'Kenny',
        id: 321,
        createdTimestamp: 1600000000000,
      });

      // Act (When)
      const zombieRo = await controller.findOne(321);

      // Assert (Then)
      expect(zombieRo).toEqual({
        name: 'Kenny',
        id: 321,
        createdTimestamp: 1600000000000,
      });
    });

    it('should call repository when finding all zombies', async () => {
      // Arrange (Given)
      zombieRepositoryMock.findAllZombies.mockResolvedValue([]);

      // Act (When)
      expect(zombieRepositoryMock.findAllZombies).not.toHaveBeenCalled();

      await controller.findAll();

      // Assert (Then)
      expect(zombieRepositoryMock.findAllZombies).toHaveBeenCalledTimes(1);
    });

    it('should response with properly mapped zombies when finding all', async () => {
      // Arrange (Given)
      zombieRepositoryMock.findAllZombies.mockResolvedValue([
        {
          name: 'Paul',
          id: 555,
          createdTimestamp: 1500000000000,
        },
        {
          name: 'Jackie Welles',
          id: 666,
          createdTimestamp: 3400000000000,
        },
      ]);

      // Act (When)
      const zombieRos = await controller.findAll();

      // Assert (Then)
      expect(zombieRos).toEqual([
        {
          name: 'Paul',
          id: 555,
          createdTimestamp: 1500000000000,
        },
        {
          name: 'Jackie Welles',
          id: 666,
          createdTimestamp: 3400000000000,
        },
      ]);
    });
  });

  describe('Updating', () => {
    it('should call repository when updating', async () => {
      // Arrange (Given)
      zombieRepositoryMock.findZombieById.mockResolvedValue({
        save: jest.fn(),
      });

      // Act (When)
      expect(zombieRepositoryMock.findZombieById).not.toHaveBeenCalled();

      await controller.update(44, { name: 'Andy' });

      // Assert (Then)
      expect(zombieRepositoryMock.findZombieById).toHaveBeenCalledTimes(1);
      expect(zombieRepositoryMock.findZombieById).toHaveBeenLastCalledWith(44);
    });

    it('should save zombie when updating', async () => {
      // Arrange (Given)
      const zombieEntity = { save: jest.fn() };
      zombieRepositoryMock.findZombieById.mockResolvedValue(zombieEntity);

      // Act (When)
      await controller.update(77, { name: 'Garry' });

      // Assert (Then)
      expect(zombieEntity.save).toHaveBeenCalledTimes(1);
    });

    it('should properly map zombie, keeping the original creation timestamp when updating', async () => {
      // Arrange (Given)
      zombieRepositoryMock.findZombieById.mockResolvedValue({
        id: 77,
        name: 'Vladimir',
        createdTimestamp: 1500000000000,
        save: jest.fn(),
      });

      // Act (When)
      const zombieRo = await controller.update(77, {
        name: 'Vladimir the Undead',
      });

      // Assert (Then)
      expect(zombieRo).toEqual({
        id: 77,
        name: 'Vladimir the Undead',
        createdTimestamp: 1500000000000,
      });
    });
  });

  describe('Removing', () => {
    it('should call repository when removing', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      expect(zombieRepositoryMock.removeZombieById).not.toHaveBeenCalled();

      await controller.remove(777);

      // Assert (Then)
      expect(zombieRepositoryMock.removeZombieById).toHaveBeenCalledTimes(1);
      expect(zombieRepositoryMock.removeZombieById).toHaveBeenLastCalledWith(
        777,
      );
    });

    it('should not respond with any value when removing', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      const result = await controller.remove(1);

      // Assert (Then)
      expect(result).toBeUndefined();
    });
  });
});
