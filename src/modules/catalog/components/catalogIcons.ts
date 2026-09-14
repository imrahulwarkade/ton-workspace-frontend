import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  CloudLightning,
  Contact,
  Dumbbell,
  Globe,
  GraduationCap,
  HardDrive,
  HeartPulse,
  Kanban,
  LayoutDashboard,
  Leaf,
  PenTool,
  ShoppingBag,
  Sparkles,
  Triangle,
  Utensils,
} from 'lucide-react'
import type { CatalogIconId } from '@/modules/catalog/types'

export const CATALOG_ICONS: Record<CatalogIconId, LucideIcon> = {
  layoutDashboard: LayoutDashboard,
  contact: Contact,
  utensils: Utensils,
  dumbbell: Dumbbell,
  graduationCap: GraduationCap,
  shoppingBag: ShoppingBag,
  globe: Globe,
  leaf: Leaf,
  heartPulse: HeartPulse,
  sparkles: Sparkles,
  penTool: PenTool,
  hardDrive: HardDrive,
  triangle: Triangle,
  cloudLightning: CloudLightning,
  activity: Activity,
  kanban: Kanban,
}
