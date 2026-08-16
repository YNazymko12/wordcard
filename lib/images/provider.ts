import 'server-only'

const STYLE =
  'flat vector illustration, bold clean outlines, solid flat colors, ' +
  'dark navy line art, teal and cream palette, plain light background, ' +
  'centered, simple, no text, no letters'

export interface ImageProvider {
  readonly name: string
  generate(concept: string): Promise<Buffer>
}

const pollinations: ImageProvider = {
  name: 'pollinations',

  async generate(concept) {
    const prompt = encodeURIComponent(`${concept}, ${STYLE}`)
    const url = `https://image.pollinations.ai/prompt/${prompt}?model=flux&width=768&height=576&nologo=true`

    const token = process.env.POLLINATIONS_TOKEN
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: AbortSignal.timeout(60_000),
    })

    if (!response.ok) {
      throw new Error(`Pollinations antwortete mit ${response.status}`)
    }

    return Buffer.from(await response.arrayBuffer())
  },
}

export const imageProvider: ImageProvider = pollinations
