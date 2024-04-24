import { InternalServerErrorException } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as sharp from 'sharp';

export const downloadImgAsPng = async (url: string, fullPath: boolean = false) => {
  const response = await fetch(url);
  if (!response.ok) throw new InternalServerErrorException('Image download failed');
  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  const completePath = path.join(folderPath, imageName);
  // fs.writeFileSync(`${folderPath}/${imageName}`, buffer);
  await sharp(buffer).png().ensureAlpha().toFile(completePath);
  return fullPath ? completePath : imageName;
};

export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;
  const completePath = path.join(folderPath, imageNamePng);

  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(completePath);

  return fullPath ? completePath : imageNamePng;

};