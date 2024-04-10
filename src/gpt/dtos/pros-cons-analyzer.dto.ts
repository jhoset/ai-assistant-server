import { IsString } from 'class-validator';

export class ProsConsAnalyzerDto {
  @IsString()
  readonly prompt: string;
}