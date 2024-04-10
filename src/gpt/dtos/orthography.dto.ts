import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrthographyDto {
  @IsString()
  readonly prompt: string;

  @IsNumber()
  @IsOptional()
  readonly maxTokens?: number;
}