'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useAI from '@/lib/hooks/use-ai'

export function NewProjectButton() {
  const { resetState } = useAI()
  return (
    <Button className='p-5' onClick={resetState}>
      <Link href="/">New Project</Link>
    </Button>
  )
}
