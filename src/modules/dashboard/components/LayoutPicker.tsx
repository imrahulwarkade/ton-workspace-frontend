'use client'

import { Check, LayoutGrid, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils/cn'
import {
  LAYOUT_PRESETS,
  LAYOUT_PRESET_IDS,
  type LayoutPreset,
  type NamedLayoutPreset,
} from '@/modules/dashboard/layouts'

type LayoutPickerProps = {
  open: boolean
  current: LayoutPreset
  onOpenChange: (open: boolean) => void
  onSelectPreset: (preset: NamedLayoutPreset) => void
  onSelectCustom: () => void
  onResetDefault: () => void
}

export function LayoutPicker({
  open,
  current,
  onOpenChange,
  onSelectPreset,
  onSelectCustom,
  onResetDefault,
}: LayoutPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Dashboard layout</DialogTitle>
          <DialogDescription>
            Pick a preset, or choose Custom to drag and resize each panel.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          {LAYOUT_PRESET_IDS.map((presetId) => {
            const preset = LAYOUT_PRESETS[presetId]
            const selected = current === presetId
            return (
              <button
                key={presetId}
                type="button"
                onClick={() => {
                  onSelectPreset(presetId)
                  onOpenChange(false)
                }}
                className={cn(
                  'surface-panel rounded-sm p-3 text-left',
                  selected && 'border-primary/50 ring-primary/30 ring-1'
                )}
              >
                <LayoutPreview columns={preset.columns} />
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      {preset.label}
                      {preset.isDefault ? ' · Default' : ''}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {preset.description}
                    </p>
                  </div>
                  {selected ? (
                    <Check className="text-primary h-4 w-4 shrink-0" />
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            onSelectCustom()
            onOpenChange(false)
          }}
          className={cn(
            'surface-panel mt-3 flex w-full items-center gap-3 rounded-sm p-3 text-left',
            current === 'custom' && 'border-primary/50 ring-primary/30 ring-1'
          )}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" />
          <span className="flex-1">
            <span className="block text-sm font-medium">Custom</span>
            <span className="text-muted-foreground text-xs">
              Position and size each panel yourself in Edit mode.
            </span>
          </span>
          {current === 'custom' ? (
            <Check className="text-primary h-4 w-4" />
          ) : null}
        </button>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onResetDefault()
              onOpenChange(false)
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset to default
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LayoutPreview({ columns }: { columns: number }) {
  const cells = Array.from({ length: Math.min(columns * 2, 8) })
  return (
    <div
      className="bg-muted/50 grid h-16 gap-1 rounded-md p-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {cells.map((_, index) => (
        <span
          key={index}
          className="rounded-sm [background-image:linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,77,46,0.28))]"
        />
      ))}
    </div>
  )
}
