import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand
} from '@aws-sdk/client-s3';
//import 'npm:dotenv/config';
import { readFile } from 'node:fs/promises';

interface S3Config {
  access_key_id: string;
  secret_access_key: string;
  bucket: string;
  host: string;
  region?: string;
  username?: string;
}

function clientFromConfig(config: S3Config) {
  const isAws = config.host.includes('amazonaws.com');

  return new S3Client({
    region: config.region ?? 'auto',
    endpoint: isAws ? undefined : `https://${config.host}`,
    forcePathStyle: !isAws,
    credentials: {
      accessKeyId: config.access_key_id,
      secretAccessKey: config.secret_access_key
    }
  });
}

async function listObjects(client: S3Client, bucket: string) {
  const response = await client.send(
    new ListObjectsV2Command({ Bucket: bucket })
  );
  const objects = response.Contents ?? [];
  console.log(`Found ${objects.length} objects in ${bucket}:`);
  objects.forEach(obj => console.log(` ${obj.Key} (${obj.Size} bytes)`));
  return objects;
}

function isUuidOutputJsonl(key: string | undefined): boolean {
  if (!key) {
    return false;
  }

  return /^\/?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/output\.jsonl$/i.test(
    key
  );
}

async function streamToString(
  body: AsyncIterable<Uint8Array>
): Promise<string> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of body) {
    chunks.push(chunk);
  }

  return new TextDecoder().decode(Buffer.concat(chunks));
}

async function printMatchingOutputFiles(
  client: S3Client,
  bucket: string,
  keys: string[]
): Promise<void> {
  await Promise.all(
    keys.map(async key => {
      const response = await client.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );

      console.log(`\n=== ${key} ===`);

      if (!response.Body) {
        console.log('(empty body)');
        return;
      }

      const content = await streamToString(
        response.Body as AsyncIterable<Uint8Array>
      );
      console.log(content);
    })
  );
}

async function upload(
  client: S3Client,
  bucket: string,
  key: string,
  filePath: string
) {
  const body = await readFile(filePath);
  await client.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body })
  );
  console.log(`Uploaded ${filePath} → s3://${bucket}/${key}`);
}

const config: S3Config = JSON.parse(await readFile('./config.json'));
const client = clientFromConfig(config);

const objects = await listObjects(client, config.bucket);
const matchingKeys = objects
  .map(obj => obj.Key)
  .filter((key): key is string => isUuidOutputJsonl(key));

if (!matchingKeys.length) {
  console.log('\nNo UUID output.jsonl objects found.');
} else {
  await printMatchingOutputFiles(client, config.bucket, matchingKeys);
}
