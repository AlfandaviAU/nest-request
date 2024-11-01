import { IsNumber, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  name: string;

  @IsNumber()
  duration: number;
}
