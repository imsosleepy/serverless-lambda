'use strict';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({});
const RESIZE_WIDTH = 400;

export const main = async (event, callback) => {
  const { request, response } = event.Records[0].cf;

  const imgUrl = decodeURIComponent(request.uri);

  const Key = imgUrl.substring(1); // imgUrl이 endpoint
  const Bucket = request.origin.s3.domainName.split('.')[0]; // 버킷 이름 가져오기
  const params = {
    Bucket, 
    Key, 
  };

  const command = new GetObjectCommand(params);

  const { Body } = await s3Client.send(command); // s3 Client
  const b = await Body.transformToByteArray();
  const buff = Buffer.from(b, 'utf-8');

  // webp base64 로 변환
  const webpBase64 = await convertToWebPAndBase64(buff, 90);

  response.headers['content-type'] = [
    { key: 'Content-Type', value: 'image/webp' },
  ];
  response.headers['content-length'] = [
    { key: 'Content-Length', value: webpBase64.length.toString() },
  ];
  response.body = webpBase64;
  response.bodyEncoding = 'base64';

  callback(null, response);
};

// Webp Covert 파일 base64 리턴
const convertToWebPAndBase64 = async (buff, quality) => {
  const image = sharp(buff);
  const { width } = await image.metadata();
  const webpBuffer = await image.rotate()
                                .resize(width > RESIZE_WIDTH ? RESIZE_WIDTH : null)
                                .webp({ quality })
                                .toBuffer();

  return webpBuffer.toString('base64');
};
