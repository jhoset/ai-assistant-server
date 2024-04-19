import OpenAI from 'openai';
import * as path from 'node:path';
import * as fs from 'node:fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (openai: OpenAI, { prompt, voice }: Options) => {

  const voices = {
    'alloy': 'alloy',
    'echo': 'echo',
    'fable': 'fable',
    'onyx': 'onyx',
    'nova': 'nova',
    'shimmer': 'shimmer',
  };
  const selectedVoice = voices[voice] ?? 'nova';

  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, { recursive: true });

  const resp = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);
  return speechFile;
};
