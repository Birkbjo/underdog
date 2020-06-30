import AdmZip, { IZipEntry } from 'adm-zip';
import crypto, { HexBase64Latin1Encoding } from 'crypto';
import { hashElement } from 'folder-hash';

const dateFormat = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z|([+\-])(\d{2}):(\d{2}))$/;

export function dateReviver(key: string, value: unkown): string | unknown {
  if (typeof value === 'string' && dateFormat.test(value)) {
    return new Date(value);
  }
  return value;
}

export async function extractZip(
  buffer: Buffer,
  extractPath: string
): Promise<AdmZip> {
  const zip = new AdmZip(buffer);
  await new Promise((resolve, reject) => {
    zip.extractAllToAsync(extractPath, true, (err) =>
      err ? reject(err) : resolve(true)
    );
  });
  return zip;
}

export async function computeHashes(
  zipEntries: IZipEntry[]
): Promise<string[]> {
  const hashes = zipEntries.map(async (entry) => {
    const data = (await new Promise((resolve, reject) => {
      entry.getDataAsync((uncompressedData: Buffer) => {
        resolve(uncompressedData);
      });
    })) as Buffer;
    return crypto.createHash('md5').update(data).digest('hex');
  });
  return Promise.all(hashes);
}

export async function computeDirHash(dirPath: string | string[]) {
  const opts: { algo: string; encoding: HexBase64Latin1Encoding } = {
    algo: 'md5',
    encoding: 'hex',
  };
  if (typeof dirPath === 'string') {
    // eslint-disable-next-line no-param-reassign
    dirPath = [dirPath];
  }

  const hashes = await Promise.all(dirPath.map((p) => hashElement(p, opts)));
  const dirsHash = crypto.createHash(opts.algo);
  hashes.forEach((h) => dirsHash.update(h.hash));
  const hash = dirsHash.digest(opts.encoding);
  return hash;
}
