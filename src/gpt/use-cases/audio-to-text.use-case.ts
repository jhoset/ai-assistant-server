import OpenAI from 'openai';
import * as fs from 'node:fs';


interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    prompt: prompt, //! Same language
    file: fs.createReadStream(audioFile.path),
    language: 'en',
    response_format: 'json',
  });
  return response;
};