import { Injectable, NotFoundException } from '@nestjs/common';
import {
  orthographyUseCase,
  prosConsStreamUseCase,
  prosConsUseCase,
  translateStreamUseCase,
  translateUseCase,
  textToAudioUseCase, audioToTextUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsAnalyzerDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'node:fs';

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

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return textToAudioUseCase(this.openai, { prompt, voice });
  }

  async getAudioById(fileId: string) {
    const filePath = path.resolve(__dirname, `../../generated/audios/${fileId}.mp3`);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Audio with ID = ${fileId} does not exists`);
    }

    return filePath;
  }

  async audioToText(audioFile: Express.Multer.File, prompt?: string) {
    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }

}
