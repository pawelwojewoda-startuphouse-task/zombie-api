import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZombieService } from './zombie.service';
import { ZombieController } from './zombie.controller';
import { ZombieRepository } from './zombie.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ZombieRepository])],
  controllers: [ZombieController],
  providers: [ZombieService],
  exports: [ZombieService],
})
export class ZombieModule {}
