'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { APP_TYPE_LABELS } from '@/lib/constants/appTypes'
import { BRAND_LABELS } from '@/lib/constants/brands'
import { accentTile } from '@/lib/constants/accents'
import { cn } from '@/lib/utils/cn'
import { AppForm } from '@/modules/catalog/components/AppForm'
import { CATALOG_ICONS } from '@/modules/catalog/components/catalogIcons'
import { catalogKeys, useCatalog } from '@/modules/catalog/hooks/useCatalog'
import type { CatalogAppFormValues } from '@/modules/catalog/schemas/appSchema'
import {
  createCatalogApp,
  deleteCatalogApp,
  updateCatalogApp,
} from '@/modules/catalog/services/catalogApi'
import type { CatalogApp } from '@/modules/catalog/types'

type EditorState =
  { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; app: CatalogApp }

export function ManageAppsPage() {
  const queryClient = useQueryClient()
  const { allApps, isLoading } = useCatalog()
  const [editor, setEditor] = useState<EditorState>({ mode: 'closed' })

  const createMutation = useMutation({
    mutationFn: createCatalogApp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: catalogKeys.apps })
      setEditor({ mode: 'closed' })
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: CatalogAppFormValues
    }) => updateCatalogApp(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: catalogKeys.apps })
      setEditor({ mode: 'closed' })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteCatalogApp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: catalogKeys.apps })
    },
  })

  function handleCreate(values: CatalogAppFormValues) {
    createMutation.mutate(values)
  }

  function handleEdit(values: CatalogAppFormValues) {
    if (editor.mode !== 'edit') return
    updateMutation.mutate({ id: editor.app.id, values })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Manage URLs</h1>
          <p className="page-subtitle">
            Add staging and production links. They become panels you can drop
            onto a workspace dashboard.
          </p>
        </div>
        <Button onClick={() => setEditor({ mode: 'create' })}>
          <Plus className="h-4 w-4" />
          Add URL
        </Button>
      </div>

      <div className="data-table">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium">App</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Brand
              </th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                Type
              </th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="text-muted-foreground px-4 py-6" colSpan={5}>
                  Loading URLs…
                </td>
              </tr>
            ) : null}
            {allApps.map((app) => {
              const Icon = CATALOG_ICONS[app.icon]
              return (
                <tr key={app.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-sm',
                          accentTile(app.accentClass)
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-muted-foreground max-w-xs truncate text-xs">
                          {app.productionUrl}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {BRAND_LABELS[app.brand]}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {APP_TYPE_LABELS[app.type]}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {app.isCustom ? 'Added' : 'Seeded'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Edit ${app.name}`}
                        onClick={() => setEditor({ mode: 'edit', app })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Remove ${app.name}`}
                        onClick={() => deleteMutation.mutate(app.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog
        open={editor.mode !== 'closed'}
        onOpenChange={(open) => {
          if (!open) setEditor({ mode: 'closed' })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editor.mode === 'edit' ? 'Edit URL' : 'Add URL'}
            </DialogTitle>
            <DialogDescription>
              Both environments are stored so the Staging / Production toggle
              keeps working.
            </DialogDescription>
          </DialogHeader>
          {editor.mode === 'edit' ? (
            <AppForm
              key={editor.app.id}
              defaultValues={toFormValues(editor.app)}
              submitLabel="Save URL"
              onSubmit={handleEdit}
              onCancel={() => setEditor({ mode: 'closed' })}
            />
          ) : editor.mode === 'create' ? (
            <AppForm
              key="create"
              submitLabel="Add URL"
              onSubmit={handleCreate}
              onCancel={() => setEditor({ mode: 'closed' })}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function toFormValues(app: CatalogApp): CatalogAppFormValues {
  return {
    name: app.name,
    description: app.description,
    brand: app.brand,
    type: app.type,
    icon: app.icon,
    accentClass: app.accentClass as CatalogAppFormValues['accentClass'],
    stagingUrl: app.stagingUrl,
    productionUrl: app.productionUrl,
    openInNewTab: app.openInNewTab,
  }
}
