'use client';

import React, { useState, useCallback, memo } from 'react';
import { FilterOptions } from '@/lib/types';
import { useDataContext } from '../providers/DataProvider';

const CATEGORIES = ['CPU', 'Memory', 'Network', 'Disk', 'API'];

function FilterPanelComponent() {
  const { filters, setFilters } = useDataContext();
  const [localFilters, setLocalFilters] = useState<FilterOptions>({
    categories: filters?.categories || CATEGORIES,
    minValue: filters?.minValue,
    maxValue: filters?.maxValue,
  });

  const handleCategoryToggle = useCallback((category: string) => {
    setLocalFilters((prev) => {
      const categories = prev.categories || CATEGORIES;
      const newCategories = categories.includes(category)
        ? categories.filter((c) => c !== category)
        : [...categories, category];
      return { ...prev, categories: newCategories };
    });
  }, []);

  const handleApply = useCallback(() => {
    setFilters(localFilters);
  }, [localFilters, setFilters]);

  const handleClear = useCallback(() => {
    const cleared = {
      categories: CATEGORIES,
      minValue: undefined,
      maxValue: undefined,
    };
    setLocalFilters(cleared);
    setFilters(null);
  }, [setFilters]);

  return (
    <div
      className="filter-panel"
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '3px',
            height: '18px',
            background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '2px',
            marginRight: '10px',
          }}
        />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>
          Filters
        </h3>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>
          Categories
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((category) => (
            <label
              key={category}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                background: localFilters.categories?.includes(category)
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: localFilters.categories?.includes(category)
                  ? '#fff'
                  : '#e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                border: localFilters.categories?.includes(category)
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
                boxShadow: localFilters.categories?.includes(category)
                  ? '0 2px 4px rgba(59, 130, 246, 0.3)'
                  : 'none',
              }}
              onMouseEnter={(e) => {
                if (!localFilters.categories?.includes(category)) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!localFilters.categories?.includes(category)) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <input
                type="checkbox"
                checked={localFilters.categories?.includes(category) || false}
                onChange={() => handleCategoryToggle(category)}
                style={{ marginRight: '4px' }}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>
          Value Range
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minValue || ''}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  minValue: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                width: '90px',
                fontSize: '13px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>to</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxValue || ''}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  maxValue: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                width: '90px',
                fontSize: '13px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button
          onClick={handleApply}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
          }}
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export const FilterPanel = memo(FilterPanelComponent);

