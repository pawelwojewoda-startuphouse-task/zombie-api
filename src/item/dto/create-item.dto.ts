import { IsNotEmpty, IsInt, IsArray, ValidateIf } from 'class-validator';
import { CreateOneItemDto, CreateManyItemsDto } from '.';

export class CreateItemDto
  implements Partial<CreateOneItemDto>, Partial<CreateManyItemsDto> {
  @ValidateIf((o) => 'externalIds' in o)
  @IsArray({ groups: ['createMany'] })
  @IsNotEmpty({ groups: ['createMany'] })
  @IsInt({ groups: ['createMany'], each: true })
  externalIds?: number[];

  @ValidateIf((o) => !('externalIds' in o))
  @IsNotEmpty({ groups: ['createOne'] })
  @IsInt({ groups: ['createOne'] })
  externalId?: number;
}
