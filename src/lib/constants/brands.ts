export const BRANDS = [
  'toneopfit',
  'toneopeats',
  'toneop',
  'appofit',
  'shared',
] as const

export type BrandId = (typeof BRANDS)[number]

export const BRAND_LABELS: Record<BrandId, string> = {
  toneopfit: 'ToneOpFit',
  toneopeats: 'ToneOpEats',
  toneop: 'ToneOp',
  appofit: 'Appofit',
  shared: 'Workspace & infra',
}
