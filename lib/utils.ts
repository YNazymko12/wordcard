import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Without this, twMerge reads the custom text-label size as a text colour
// and drops it whenever a colour class follows in the same cn() call.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['label'] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
