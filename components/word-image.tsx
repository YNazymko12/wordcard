import Image from 'next/image'

export function WordImage({
  src,
  word,
  sizes,
  priority,
}: {
  src: string | null
  word: string
  sizes: string
  priority?: boolean
}) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/15 to-teal/10">
        <span className="font-display text-5xl font-bold text-primary/25">
          {word.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={word}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
  )
}
