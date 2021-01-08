import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemPurchaseModule } from '../item-purchase/item-purchase.module';
import { CurrencyModule } from '../currency/currency.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemRepository } from './item.repository';
import { ZombieModule } from '../zombie/zombie.module';

@Module({
  imports: [
    ItemPurchaseModule,
    CurrencyModule,
    ZombieModule,
    TypeOrmModule.forFeature([ItemRepository]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
