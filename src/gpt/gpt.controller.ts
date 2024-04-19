import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsAnalyzerDto, TranslateDto, TextToAudioDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {
  }

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-analyzer')
  proConsAnalyzer(@Body() prosConsAnalyzerDto: ProsConsAnalyzerDto) {
    return this.gptService.proConsAnalyzer(prosConsAnalyzerDto);
  }

  @Post('pros-cons-analyzer-stream')
  async proConsAnalyzerStream(
    @Body() prosConsAnalyzerDto: ProsConsAnalyzerDto,
    @Res() response: Response) {
    const stream = await this.gptService.proConsAnalyzerStream(prosConsAnalyzerDto);
    response.setHeader('Content-Type', 'application/json');
    response.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      response.write(piece);
    }
    response.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('translate-stream')
  async translateStream(
    @Body() translateDto: TranslateDto,
    @Res() response: Response) {
    const stream = await this.gptService.translateStream(translateDto);
    response.setHeader('Content-Type', 'application/json');
    response.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      response.write(piece);
    }
    response.end();
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() response: Response,
  ) {

    const filePath = await this.gptService.textToAudio(textToAudioDto);
    response.setHeader('Content-Type', 'audio/mp3');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async getAudioById(
    @Param('fileId') fileId: string,
    @Res() response: Response) {
    const filePath = await this.gptService.getAudioById(fileId);
    response.setHeader('Content-Type', 'audio/mp3');
    response.sendFile(filePath);
  }

}
