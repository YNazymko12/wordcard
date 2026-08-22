import 'server-only'

const STYLE =
  'minimal flat illustration, plain off-white background, ' +
  'clear and easy to recognise, no text, no letters'

const MODEL = '@cf/black-forest-labs/flux-1-schnell'
const RETRIES = 3

export interface ImageProvider {
  readonly name: string
  generate(concept: string): Promise<Buffer>
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const cloudflare: ImageProvider = {
  name: 'cloudflare',

  async generate(concept) {
    const account = process.env.CLOUDFLARE_ACCOUNT_ID
    const token = process.env.CLOUDFLARE_API_TOKEN

    if (!account || !token) {
      throw new Error('Cloudflare-Zugangsdaten fehlen.')
    }

    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ prompt: `${concept}, ${STYLE}`, steps: 8 }),
          signal: AbortSignal.timeout(60_000),
        },
      )

      if (response.status === 429 && attempt < RETRIES) {
        await wait(attempt * 5_000)
        continue
      }

      if (!response.ok) {
        throw new Error(`Cloudflare antwortete mit ${response.status}`)
      }

      const payload = (await response.json()) as { result?: { image?: string } }

      if (!payload.result?.image) {
        throw new Error('Cloudflare lieferte kein Bild.')
      }

      return Buffer.from(payload.result.image, 'base64')
    }

    throw new Error('Cloudflare ist ausgelastet.')
  },
}

const recraft: ImageProvider = {
  name: 'recraft',

  async generate(concept) {
    const token = process.env.RECRAFT_API_KEY
    const styleId = process.env.RECRAFT_STYLE_ID

    if (!token) {
      throw new Error('Recraft-Zugangsdaten fehlen.')
    }

    const response = await fetch(
      'https://external.api.recraft.ai/v1/images/generations',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          prompt: styleId ? concept : `${concept}, ${STYLE}`,
          model: 'recraftv2',
          size: '1024x1024',
          response_format: 'b64_json',
          ...(styleId
            ? { style_id: styleId }
            : { style: 'digital_illustration' }),
        }),
        signal: AbortSignal.timeout(120_000),
      },
    )

    if (!response.ok) {
      throw new Error(`Recraft antwortete mit ${response.status}`)
    }

    const payload = (await response.json()) as {
      data?: { b64_json?: string; url?: string }[]
    }

    const image = payload.data?.[0]

    if (image?.b64_json) {
      return Buffer.from(image.b64_json, 'base64')
    }

    if (image?.url) {
      const file = await fetch(image.url, {
        signal: AbortSignal.timeout(60_000),
      })

      return Buffer.from(await file.arrayBuffer())
    }

    throw new Error('Recraft lieferte kein Bild.')
  },
}

const PROVIDERS: Record<string, ImageProvider> = { cloudflare, recraft }

export const imageProvider: ImageProvider =
  PROVIDERS[process.env.IMAGE_PROVIDER ?? ''] ?? recraft
