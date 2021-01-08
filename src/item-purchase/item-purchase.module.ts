import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common/http';
import { ItemPurchaseService } from './item-purchase.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ItemPurchaseService],
  exports: [ItemPurchaseService],
})
export class ItemPurchaseModule {}
