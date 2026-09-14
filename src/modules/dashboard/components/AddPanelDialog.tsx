'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCatalog } from '@/modules/catalog/hooks/useCatalog'
import { CATALOG_ICONS } from '@/modules/catalog/components/catalogIcons'
import { accentTile } from '@/lib/constants/accents'
import { cn } from '@/lib/utils/cn'
import type { DashboardPanel } from '@/modules/dashboard/types'

const customLinkSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  customUrl: z.string().trim().url('Enter a valid URL'),
  customDescription: z.string().trim().optional(),
})

type CustomLinkValues = z.infer<typeof customLinkSchema>

type AddPanelDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (panel: Omit<DashboardPanel, 'id'>) => void
}

export function AddPanelDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPanelDialogProps) {
  const { roleApps } = useCatalog()
  const [tab, setTab] = useState<'catalog' | 'custom'>('catalog')
  const [query, setQuery] = useState('')
  const form = useForm<CustomLinkValues>({
    resolver: zodResolver(customLinkSchema),
    defaultValues: { title: '', customUrl: 'https://', customDescription: '' },
  })

  const filtered = roleApps.filter((app) =>
    `${app.name} ${app.description}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add panel</DialogTitle>
          <DialogDescription>
            Pin a catalog app or drop in any URL as a workspace shortcut.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={tab === 'catalog' ? 'default' : 'outline'}
            onClick={() => setTab('catalog')}
          >
            From catalog
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === 'custom' ? 'default' : 'outline'}
            onClick={() => setTab('custom')}
          >
            Custom URL
          </Button>
        </div>

        {tab === 'catalog' ? (
          <div className="space-y-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search apps"
            />
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {filtered.map((app) => {
                const Icon = CATALOG_ICONS[app.icon]
                return (
                  <button
                    key={app.id}
                    type="button"
                    className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left"
                    onClick={() => {
                      onAdd({
                        kind: 'app',
                        title: app.name,
                        appId: app.id,
                      })
                      onOpenChange(false)
                    }}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-sm',
                        accentTile(app.accentClass)
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        {app.name}
                      </span>
                      <span className="text-muted-foreground block text-xs">
                        {app.description}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              onAdd({
                kind: 'custom',
                title: values.title,
                customUrl: values.customUrl,
                customDescription: values.customDescription,
              })
              form.reset()
              onOpenChange(false)
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="panel-title">Title</Label>
              <Input id="panel-title" {...form.register('title')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panel-url">URL</Label>
              <Input id="panel-url" {...form.register('customUrl')} />
              {form.formState.errors.customUrl ? (
                <p className="text-destructive text-sm">
                  {form.formState.errors.customUrl.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="panel-note">Note</Label>
              <Input id="panel-note" {...form.register('customDescription')} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add panel</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
