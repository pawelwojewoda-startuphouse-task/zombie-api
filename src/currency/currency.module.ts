import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common/http';
import { CurrencyService } from './currency.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
