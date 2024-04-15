import { Injectable } from '@nestjs/common';
import {
  orthographyUseCase,
  prosConsStreamUseCase,
  prosConsUseCase,
  translateStreamUseCase,
  translateUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsAnalyzerDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import * as process from 'node:process';

@Injectable()
export class GptService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Only will call use cases
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyUseCase(this.openai, { prompt: orthographyDto.prompt });
  }

  async proConsAnalyzer(prosConsAnalyzerDto: ProsConsAnalyzerDto) {
    return await prosConsUseCase(this.openai, { prompt: prosConsAnalyzerDto.prompt });
  }

  async proConsAnalyzerStream(prosConsAnalyzerDto: ProsConsAnalyzerDto) {
    return prosConsStreamUseCase(this.openai, { prompt: prosConsAnalyzerDto.prompt });
  }

  async translate(translateDto: TranslateDto) {
    return translateUseCase(this.openai, { prompt: translateDto.prompt, lang: translateDto.lang });
  }

  async translateStream(translateDto: TranslateDto) {
    return translateStreamUseCase(this.openai, { prompt: translateDto.prompt, lang: translateDto.lang });
  }
}
