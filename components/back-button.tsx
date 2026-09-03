'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BackButton({ href, label }: { href: string; label: string }) {
  const router = useRouter()

  function goBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(href)
  }

  return (
    <Button variant="ghost" size="sm" className="-ml-2 w-fit" onClick={goBack}>
      <ArrowLeft data-icon="inline-start" />
      {label}
    </Button>
  )
}
