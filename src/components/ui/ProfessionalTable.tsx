import React from 'react';
import { brandTokens } from '@/lib/design-tokens';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
  className?: string;
  striped?: boolean;
  compact?: boolean;
}

export function ProfessionalTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = "No data available",
  sortKey,
  sortDirection,
  onSort,
  className = '',
  striped = true,
  compact = false
}: TableProps<T>) {
  if (loading) {
    return (
      <div className={`data-table ${className}`}>
        <div className="p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`data-table ${className}`}>
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className={`${brandTokens.typography.heading.sm} text-red-900 mb-2`}>
            Error Loading Data
          </h3>
          <p className={`${brandTokens.typography.body.sm} text-red-600`}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`data-table ${className}`}>
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <h3 className={`${brandTokens.typography.heading.sm} text-gray-900 mb-2`}>
            No Data Available
          </h3>
          <p className={`${brandTokens.typography.body.sm} text-gray-600`}>
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  const handleSort = (key: keyof T) => {
    if (onSort) {
      onSort(key);
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const getAlignmentClass = (align: string = 'left') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={`data-table ${className} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                    ${getAlignmentClass(column.align)}
                    ${column.sortable ? 'cursor-pointer hover:bg-blue-100 select-none' : ''}
                    transition-colors duration-200
                  `}
                  style={{ width: column.width }}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center gap-2 justify-between">
                    <span className={brandTokens.typography.label.md}>
                      {column.label}
                    </span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`
                  ${striped && index % 2 === 0 ? 'bg-gray-50/50' : ''}
                  hover:bg-blue-50/50 transition-colors duration-200
                `}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`
                      ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                      ${getAlignmentClass(column.align)}
                      border-b border-gray-100 last:border-b-0
                    `}
                  >
                    <div className={brandTokens.typography.body.sm}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key])
                      }
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Specialized table components
export function FinancialTable<T extends Record<string, unknown>>({
  data,
  columns,
  className = '',
  ...props
}: Omit<TableProps<T>, 'striped' | 'compact'>) {
  return (
    <ProfessionalTable
      data={data}
      columns={columns}
      className={`border border-gray-200 ${className}`}
      striped={true}
      compact={false}
      {...props}
    />
  );
}

export function CompactTable<T extends Record<string, unknown>>({
  data,
  columns,
  className = '',
  ...props
}: Omit<TableProps<T>, 'striped' | 'compact'>) {
  return (
    <ProfessionalTable
      data={data}
      columns={columns}
      className={className}
      striped={false}
      compact={true}
      {...props}
    />
  );
} 