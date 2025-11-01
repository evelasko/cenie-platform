'use client'

import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'
import { Search, X } from 'lucide-react'
import type { VolumeType } from '@/types/books'

interface CatalogFiltersProps {
  categories: string[]
  selectedCategories: string[]
  selectedType: VolumeType | 'all'
  searchQuery: string
  onSearchChange: (query: string) => void
  onCategoryToggle: (category: string) => void
  onTypeChange: (type: VolumeType | 'all') => void
  onReset: () => void
}

export function CatalogFilters({
  categories,
  selectedCategories,
  selectedType,
  searchQuery,
  onSearchChange,
  onCategoryToggle,
  onTypeChange,
  onReset,
}: CatalogFiltersProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedType !== 'all' || searchQuery !== ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={clsx(TYPOGRAPHY.h4, 'text-black')}>Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className={clsx(
              TYPOGRAPHY.bodySmall,
              'text-primary hover:text-primary/80 flex items-center gap-1'
            )}
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-black mb-2')}>
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/50" />
          <input
            type="text"
            placeholder="Buscar por título, autor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={clsx(
              TYPOGRAPHY.bodyBase,
              'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-black mb-2')}>
          Tipo de Publicación
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as VolumeType | 'all')}
          className={clsx(
            TYPOGRAPHY.bodyBase,
            'w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary'
          )}
        >
          <option value="all">Todas</option>
          <option value="translated">Traducciones</option>
          <option value="original">Publicaciones Originales</option>
          <option value="adapted">Ediciones Adaptadas</option>
        </select>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <label className={clsx(TYPOGRAPHY.bodySmall, 'block font-medium text-black mb-2')}>
            Categorías
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-none transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryToggle(category)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded-none"
                />
                <span className={clsx(TYPOGRAPHY.bodySmall, 'text-black/80')}>
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className={clsx(TYPOGRAPHY.bodySmall, 'text-black/60 mb-2')}>
            Filtros activos:
          </p>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                Búsqueda: "{searchQuery}"
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                Tipo: {selectedType}
              </span>
            )}
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

