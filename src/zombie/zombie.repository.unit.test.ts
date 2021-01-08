import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ZombieRepository } from './zombie.repository';

describe('ZombieRepository', () => {
  let zombieRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ZombieRepository],
    }).compile();

    zombieRepository = await module.get<ZombieRepository>(ZombieRepository);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(zombieRepository).toBeDefined();
    });
  });

  describe('Finding', () => {
    it('should call find function when finding all', async () => {
      // Arrange (Given)
      zombieRepository.find = jest.fn().mockResolvedValue([]);

      // Act (When)
      expect(zombieRepository.find).not.toHaveBeenCalled();

      await zombieRepository.findAllZombies();

      // Assert (Then)
      expect(zombieRepository.find).toHaveBeenCalled();
    });

    it('should call find function when finding one item by ids', async () => {
      // Arrange (Given)
      zombieRepository.findOne = jest.fn().mockResolvedValue({});

      // Act (When)
      expect(zombieRepository.findOne).not.toHaveBeenCalled();

      await zombieRepository.findZombieById(44);

      // Assert (Then)
      expect(zombieRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when finding one given it is non-existent', async () => {
      // Arrange (Given)
      zombieRepository.findOne = jest.fn().mockResolvedValue(null);
      const expectedError = new NotFoundException(
        'Could not find zombie with id "9999"',
      );

      // Act (When)
      await expect(
        async () => await zombieRepository.findZombieById(9999),

        // Assert (Then)
      ).rejects.toThrowError(expectedError);
    });
  });

  describe('Removing', () => {
    it('should call delete function when removing one', async () => {
      // Arrange (Given)
      zombieRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      // Act (When)
      expect(zombieRepository.delete).not.toHaveBeenCalled();

      await zombieRepository.removeZombieById(1);

      // Assert (Then)
      expect(zombieRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when removing one given it does not exist', async () => {
      // Arrange (Given)
      zombieRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });
      const expectedError = new NotFoundException(
        'Could not find zombie with id "999"',
      );

      // Act (When)
      await expect(
        async () => await zombieRepository.removeZombieById(999),

        // Assert (Then)
      ).rejects.toThrowError(expectedError);
      expect(zombieRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
