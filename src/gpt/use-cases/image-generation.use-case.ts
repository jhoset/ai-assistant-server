import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImgAsPng } from '../../helpers';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, originalImage, maskImage } = options;
  //TODO: Verify original image

  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-2',
      n: 1,
      size: '512x512',
      quality: 'hd',
      response_format: 'url',
    });
    //TODO: Save image in FS

    const fileName = await downloadImgAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url: url,
      localPath: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const pngImagePath = await downloadImgAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt: prompt,
    n: 1,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
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