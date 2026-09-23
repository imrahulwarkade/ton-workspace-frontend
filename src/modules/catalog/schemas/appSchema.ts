import { z } from 'zod'
import { ACCENT_CLASSES } from '@/lib/constants/accents'
import { APP_TYPES } from '@/lib/constants/appTypes'
import { BRANDS } from '@/lib/constants/brands'
import { CATALOG_ICON_IDS } from '@/modules/catalog/types'

export const catalogAppFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  description: z.string().trim().min(4, 'Add a short description'),
  brand: z.enum(BRANDS),
  type: z.enum(APP_TYPES),
  icon: z.enum(CATALOG_ICON_IDS),
  accentClass: z.enum(ACCENT_CLASSES),
  stagingUrl: z.string().trim().url('Enter a valid staging URL'),
  productionUrl: z.string().trim().url('Enter a valid production URL'),
  openInNewTab: z.boolean(),
})

export type CatalogAppFormValues = z.infer<typeof catalogAppFormSchema>
