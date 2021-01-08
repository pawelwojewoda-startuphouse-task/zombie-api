import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ItemRepository } from './item.repository';

describe('ItemRepository', () => {
  let itemRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ItemRepository],
    }).compile();

    itemRepository = await module.get<ItemRepository>(ItemRepository);
  });

  describe('Initialization', () => {
    it('should be defined', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(itemRepository).toBeDefined();
    });
  });

  describe('Finding', () => {
    it('should call find function when finding all by zombie id', async () => {
      // Arrange (Given)
      itemRepository.find = jest.fn().mockResolvedValue([]);

      // Act (When)
      expect(itemRepository.find).not.toHaveBeenCalled();

      await itemRepository.findItemsByZombieId(111);

      // Assert (Then)
      expect(itemRepository.find).toHaveBeenCalled();
    });

    it('should call find function when finding one', async () => {
      // Arrange (Given)
      itemRepository.find = jest.fn().mockResolvedValue([{}]);

      // Act (When)
      expect(itemRepository.find).not.toHaveBeenCalled();

      await itemRepository.findItemByIds(22, 333);

      // Assert (Then)
      expect(itemRepository.find).toHaveBeenCalled();
    });

    it('should throw an error when finding one given it is non-existent', async () => {
      // Arrange (Given)
      itemRepository.find = jest.fn().mockResolvedValue([]);
      const expectedError = new NotFoundException(
        'Could not find item with id "333" belonging to zombie with id "22"',
      );

      // Act (When)
      await expect(
        async () => await itemRepository.findItemByIds(22, 333),

        // Assert (Then)
      ).rejects.toThrowError(expectedError);
    });
  });

  describe('Removing', () => {
    it('should call remove when finding one by ids', async () => {
      // Arrange (Given)
      itemRepository.findItemByIds = jest.fn().mockResolvedValue([]);
      itemRepository.remove = jest.fn();

      // Act (When)
      expect(itemRepository.findItemByIds).not.toHaveBeenCalled();
      expect(itemRepository.remove).not.toHaveBeenCalled();

      await itemRepository.removeItemByIds(66);

      // Assert (Then)
      expect(itemRepository.findItemByIds).toHaveBeenCalledTimes(1);
      expect(itemRepository.remove).toHaveBeenCalledTimes(1);
    });
  });
});
