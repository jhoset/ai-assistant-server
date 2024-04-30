import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const message = await createMessageUseCase(this.openai, questionDto);
    const run = await createRunUseCase(this.openai, { threadId: questionDto.threadId });
    await checkCompleteStatusUseCase(this.openai, { runId: run.id, threadId: questionDto.threadId });
    return await getMessageListUseCase(this.openai, { threadId: questionDto.threadId });
  }

}
