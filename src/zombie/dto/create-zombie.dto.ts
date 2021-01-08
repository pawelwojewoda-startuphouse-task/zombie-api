import { IsNotEmpty, IsString } from 'class-validator';

export class CreateZombieDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
