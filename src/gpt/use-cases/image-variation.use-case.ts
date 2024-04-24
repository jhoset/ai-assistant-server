import OpenAI from 'openai';
import { downloadImgAsPng } from '../../helpers';
import * as fs from 'node:fs';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (openai: OpenAI, options: Options) => {
  const { baseImage } = options;

  const pngImageFullPath = await downloadImgAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImageFullPath),
    n: 1,
    size: '512x512',
    response_format: 'url',
  });

  const fileName = await downloadImgAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: url,
    localPath: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};