import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsAnalyzerDto, TranslateDto } from './dtos';
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

}
