import type { Metadata } from 'next'
import { CatalogPage } from '@/modules/catalog'

export const metadata: Metadata = {
  title: 'Apps',
}

export default function AppsPage() {
  return <CatalogPage />
}
