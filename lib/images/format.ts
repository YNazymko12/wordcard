export interface ImageFormat {
  ext: string
  contentType: string
}

const JPEG: ImageFormat = { ext: 'jpg', contentType: 'image/jpeg' }

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

const FORMATS: (ImageFormat & { matches: (bytes: Buffer) => boolean })[] = [
  {
    ext: 'webp',
    contentType: 'image/webp',
    matches: (bytes) =>
      bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
      bytes.subarray(8, 12).toString('ascii') === 'WEBP',
  },
  {
    ext: 'png',
    contentType: 'image/png',
    matches: (bytes) => bytes.subarray(0, 8).equals(PNG_MAGIC),
  },
  {
    ...JPEG,
    matches: (bytes) =>
      bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
]

export function detectFormat(bytes: Buffer): ImageFormat {
  const format = FORMATS.find((candidate) => candidate.matches(bytes))

  if (!format) {
    console.warn(
      `[image] unknown format, first bytes: ${bytes.subarray(0, 4).toString('hex')}`,
    )

    return JPEG
  }

  return { ext: format.ext, contentType: format.contentType }
}
