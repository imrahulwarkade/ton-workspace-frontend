'use client'

import { useEffect, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ACCENT_CLASSES, accentTile } from '@/lib/constants/accents'
import { APP_TYPE_LABELS, APP_TYPES } from '@/lib/constants/appTypes'
import { BRAND_LABELS, BRANDS } from '@/lib/constants/brands'
import { cn } from '@/lib/utils/cn'
import {
  catalogAppFormSchema,
  type CatalogAppFormValues,
} from '@/modules/catalog/schemas/appSchema'
import { CATALOG_ICON_IDS } from '@/modules/catalog/types'
import { CATALOG_ICONS } from '@/modules/catalog/components/catalogIcons'

const selectClassName =
  'border-input bg-background h-10 w-full rounded-sm border px-3 text-sm'

type AppFormProps = {
  defaultValues?: CatalogAppFormValues
  submitLabel: string
  onSubmit: (values: CatalogAppFormValues) => void
  onCancel: () => void
}

export function AppForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: AppFormProps) {
  const form = useForm<CatalogAppFormValues>({
    resolver: zodResolver(catalogAppFormSchema),
    defaultValues: defaultValues ?? {
      name: '',
      description: '',
      brand: 'toneopfit',
      type: 'dashboard',
      icon: 'layoutDashboard',
      accentClass: 'bg-emerald-600',
      stagingUrl: 'https://',
      productionUrl: 'https://',
      openInNewTab: true,
    },
  })

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues)
  }, [defaultValues, form])

  const icon = useWatch({ control: form.control, name: 'icon' })
  const accentClass = useWatch({
    control: form.control,
    name: 'accentClass',
  })
  const Icon = CATALOG_ICONS[icon]

  return (
    <form
      className="max-h-[70vh] space-y-4 overflow-y-auto pr-1"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={form.formState.errors.name?.message}>
          <Input {...form.register('name')} placeholder="FitBoard" />
        </Field>
        <Field label="Type" error={form.formState.errors.type?.message}>
          <select className={selectClassName} {...form.register('type')}>
            {APP_TYPES.map((type) => (
              <option key={type} value={type}>
                {APP_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Description"
        error={form.formState.errors.description?.message}
      >
        <Input
          {...form.register('description')}
          placeholder="What this URL is for"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand" error={form.formState.errors.brand?.message}>
          <select className={selectClassName} {...form.register('brand')}>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {BRAND_LABELS[brand]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Icon" error={form.formState.errors.icon?.message}>
          <select className={selectClassName} {...form.register('icon')}>
            {CATALOG_ICON_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="space-y-2">
        <Label>Tile color</Label>
        <div className="flex flex-wrap gap-2">
          {ACCENT_CLASSES.map((accent) => (
            <button
              key={accent}
              type="button"
              aria-label={accent}
              className={cn(
                'h-7 w-7 rounded-md',
                accentTile(accent),
                accentClass === accent &&
                  'ring-ring ring-offset-background ring-2 ring-offset-2'
              )}
              onClick={() => form.setValue('accentClass', accent)}
            />
          ))}
        </div>
      </div>

      <div className="border-border flex items-center gap-3 rounded-sm border p-3">
        <span
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-sm',
            accentTile(accentClass)
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-muted-foreground text-xs">Preview</p>
      </div>

      <Field
        label="Staging URL"
        error={form.formState.errors.stagingUrl?.message}
      >
        <Input {...form.register('stagingUrl')} placeholder="https://stg-..." />
      </Field>
      <Field
        label="Production URL"
        error={form.formState.errors.productionUrl?.message}
      >
        <Input {...form.register('productionUrl')} placeholder="https://..." />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register('openInNewTab')} />
        Open in a new tab
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  )
}
