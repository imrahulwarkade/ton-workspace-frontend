'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  description: z.string().trim().optional(),
})

type FormValues = z.infer<typeof schema>

type CreateDashboardDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: { name: string; description?: string }) => void
}

export function CreateDashboardDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateDashboardDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New dashboard</DialogTitle>
          <DialogDescription>
            Create a blank canvas. Add, drag, and resize panels after you save.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            onCreate({
              name: values.name,
              description: values.description,
            })
            form.reset()
            onOpenChange(false)
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="dashboard-name">Name</Label>
            <Input id="dashboard-name" {...form.register('name')} />
            {form.formState.errors.name ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dashboard-description">Description</Label>
            <Input
              id="dashboard-description"
              {...form.register('description')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
