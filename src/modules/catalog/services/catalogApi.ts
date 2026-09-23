import { fetchWithErrorHandling } from '@/lib/api/client'
import { API_CONFIG } from '@/lib/api/config'
import type { CatalogAppFormValues } from '@/modules/catalog/schemas/appSchema'
import type { CatalogApp } from '@/modules/catalog/types'

export function listCatalogApps(): Promise<CatalogApp[]> {
  return fetchWithErrorHandling<CatalogApp[]>(API_CONFIG.ENDPOINTS.Catalog.LIST)
}

export function createCatalogApp(
  payload: CatalogAppFormValues
): Promise<CatalogApp> {
  return fetchWithErrorHandling<CatalogApp, CatalogAppFormValues>(
    API_CONFIG.ENDPOINTS.Catalog.LIST,
    'POST',
    payload
  )
}

export function updateCatalogApp(
  id: string,
  payload: CatalogAppFormValues
): Promise<CatalogApp> {
  return fetchWithErrorHandling<CatalogApp, CatalogAppFormValues>(
    API_CONFIG.ENDPOINTS.Catalog.DETAIL(id),
    'PATCH',
    payload
  )
}

export function deleteCatalogApp(id: string): Promise<void> {
  return fetchWithErrorHandling<void>(
    API_CONFIG.ENDPOINTS.Catalog.DETAIL(id),
    'DELETE'
  )
}
