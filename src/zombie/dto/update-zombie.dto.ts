import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateZombieDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
